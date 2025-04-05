import { useEffect, useMemo, useState } from "react";
import {
    PUBLIC_ANSWERS_OPTIONS,
    PUBLIC_ANSWERS_OPTIONS_LABEL,
    TEST_LEVEL,
    TEST_LEVEL_LABEL,
} from "../../../config/constants/tests";
import { TestBodyItf } from "../../../types/types";
import { formatTimezone } from "../../../utils/time";
import Input from "../../../components/elements/Input";
import Select from "../../../components/elements/Select";
import { useForm } from "react-hook-form";
import Wrapper from "../../../components/wrappers/Wrapper";
import { createTestActions } from "../../../stores/createTest";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import { useMutation } from "react-query";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import { createTest, updateTest } from "../../../services/test";
import { useDispatch } from "react-redux";
import Accordion from "../../../components/accordions/Accordion";
import Checkbox from "../../../components/elements/Checkbox";

const TestInfo = () => {
    const {
        movePrevStep,
        moveNextStep,
        saveTestInfo,
        validate: validateTest,
        initializeTestParts,
    } = createTestActions;
    const {
        testTitle,
        testDatetime,
        testDescription,
        testDuration,
        testId,
        level,
        numParts,
        numQuestions,
        maxScore,
        isValidTestInfo,
        options,
    } = useSelector((state: RootState) => state.createTest);
    const [isViewingOptions, setIsViewOptions] = useState(false);

    const dispatch = useDispatch();

    const initialValues: TestBodyItf = useMemo(
        () => ({
            title: testTitle,
            datetime: testDatetime,
            description: testDescription,
            duration: testDuration,
            max_score: maxScore,
            num_questions: numQuestions,
            num_parts: numParts,
            level: level,
            options: options,
        }),
        [
            testTitle,
            testDatetime,
            testDescription,
            testDuration,
            maxScore,
            numQuestions,
            numParts,
            level,
            options,
        ]
    );

    const { mutate: createTestMutate, isLoading: createTestLoading } =
        useMutation({
            mutationFn: async (testBody: TestBodyItf) =>
                await createTest(testBody),
            mutationKey: [MUTATION_KEYS.CREATE_TEST],
            onSuccess: (data) => {
                dispatch(saveTestInfo({ testId: data?.test?.id }));
                dispatch(initializeTestParts());
                dispatch(moveNextStep());
            },
        });

    const { mutate: updateTestMutate, isLoading: updateTestLoading } =
        useMutation({
            mutationFn: async (testBody: TestBodyItf) =>
                await updateTest(testId || "", testBody),
            mutationKey: [MUTATION_KEYS.UPDATE_TEST, { testId }],
            onSuccess: (data) => {
                dispatch(initializeTestParts());
                dispatch(moveNextStep());
            },
        });

    const {
        handleSubmit,
        formState: { errors },
        register,
        setValue,
        watch,
    } = useForm<TestBodyItf>({
        defaultValues: initialValues,
    });

    const onSubmit = async (data: TestBodyItf) => {
        if (!testId) createTestMutate(data);
        else updateTestMutate(data);
    };

    const allValues = watch();

    useEffect(() => {
        const formattedStartTime = formatTimezone(
            new Date(allValues?.datetime)
        );
        setValue("datetime", formattedStartTime);
        if (options.allow_close_time.enable)
            setValue(
                "options.allow_close_time.close_time",
                allValues?.datetime
            );
        if (options.allow_show_maker_answers_after_test.enable)
            setValue(
                "options.allow_show_maker_answers_after_test.public_answers_date",
                allValues?.datetime
            );
    }, [
        allValues?.datetime,
        setValue,
        options.allow_close_time.enable,
        options.allow_show_maker_answers_after_test.enable,
    ]);

    useEffect(() => {
        dispatch(saveTestInfo(allValues));
        dispatch(validateTest());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(allValues), dispatch, saveTestInfo, validateTest]);

    useEffect(() => {
        if (
            allValues?.options.allow_show_maker_answers_after_test
                .public_answers_option ===
                PUBLIC_ANSWERS_OPTIONS.AFTER_CLOSE_TIME &&
            allValues?.options.allow_close_time.enable &&
            allValues?.options.allow_close_time.close_time
        ) {
            setValue(
                "options.allow_show_maker_answers_after_test.public_answers_date",
                allValues?.options.allow_close_time.close_time
            );
        }
    }, [
        allValues?.options.allow_show_maker_answers_after_test
            .public_answers_option,
        allValues?.options.allow_close_time.enable,
        allValues?.options.allow_close_time.close_time,
        setValue,
    ]);

    return (
        <Wrapper
            viewData={{
                headerTitle: {
                    text: "Test Information",
                },
                bottomButtons: {
                    outlinedButton: {
                        disabled: true,
                        onClick: () => dispatch(movePrevStep()),
                        text: "Back",
                    },
                    containButton: {
                        disabled:
                            !isValidTestInfo ||
                            createTestLoading ||
                            updateTestLoading,
                        isLoading: createTestLoading || updateTestLoading,
                        type: "submit",
                        text: "Next",
                        onClick: () => {
                            handleSubmit(onSubmit)();
                        },
                        loadingText: createTestLoading
                            ? "Saving..."
                            : updateTestLoading
                            ? "Updating..."
                            : null,
                    },
                },
            }}
        >
            <form className="mt-4 ">
                <div className="grid grid-cols-[2fr_5fr] gap-2">
                    <Input
                        {...register("title", {
                            required: "Title is required",
                        })}
                        error={errors?.title && errors?.title.message}
                        required
                        label={{
                            text: "Test title",
                        }}
                    />
                    <Input
                        {...register("description")}
                        label={{ text: "Test description" }}
                    />
                    <Input
                        type="datetime-local"
                        {...register("datetime", {
                            required: "Start time is required",
                        })}
                        error={errors?.datetime && errors?.datetime.message}
                        label={{ text: "Start time" }}
                        required
                    />
                    <Input
                        type="number"
                        step={5}
                        {...register("duration", {
                            required: "Duration is required",
                            min: {
                                value: 1,
                                message: "Duration must be greater than 0",
                            },
                        })}
                        disabled={options.disallow_time_limit.enable}
                        error={errors?.duration && errors?.duration.message}
                        label={{ text: "Duration (mins)" }}
                    />
                    <Input
                        type="number"
                        step={1}
                        {...register("max_score", {
                            required: "Max score is required",
                            min: {
                                value: 1,
                                message: "Max score must be greater than 0",
                            },
                        })}
                        required
                        error={errors?.max_score && errors?.max_score.message}
                        label={{ text: "Max score" }}
                    />
                    <Input
                        type="number"
                        step={1}
                        {...register("num_parts", {
                            required: "Number of parts is required",
                            min: {
                                value: 1,
                                message:
                                    "Number of parts must be greater than 0",
                            },
                            valueAsNumber: true,
                        })}
                        required
                        error={errors?.num_parts && errors?.num_parts.message}
                        label={{ text: "Number of parts" }}
                    />
                    <Input
                        type="number"
                        step={1}
                        {...register("num_questions", {
                            required: "Number of questions is required",
                            min: {
                                value:
                                    allValues.num_parts > 1
                                        ? allValues.num_parts
                                        : 1,
                                message:
                                    allValues.num_parts > 1
                                        ? `Number of questions must be at least ${allValues.num_parts}`
                                        : "Number of questions must be greater than 0",
                            },
                            valueAsNumber: true,
                        })}
                        required
                        error={
                            errors?.num_questions &&
                            errors?.num_questions.message
                        }
                        label={{ text: "Number of questions" }}
                        helperText={
                            allValues.num_parts > 1
                                ? `Must be at least ${allValues.num_parts} questions (one for each part)`
                                : ""
                        }
                    />
                    <Select
                        className="grow capitalize"
                        {...register("level")}
                        options={Object.values(TEST_LEVEL).map((level) => ({
                            label: TEST_LEVEL_LABEL[level],
                            value: level,
                        }))}
                        label={{
                            text: "Level",
                        }}
                    />
                </div>
                <Accordion
                    viewData={{
                        title: {
                            text: "Options",
                            extraClass: "capitalize",
                        },
                        extraClass: "mt-4",
                        open: isViewingOptions,
                        onToggle: () => setIsViewOptions(!isViewingOptions),
                    }}
                >
                    <div className="flex-col space-y-2 p-4">
                        <Checkbox
                            label={{ text: "Allow close time" }}
                            {...register("options.allow_close_time.enable")}
                        />
                        {options.allow_close_time.enable && (
                            <div className="grid grid-cols-[2fr_5fr] px-4 py-2 bg-orange-50">
                                <Input
                                    type="datetime-local"
                                    {...register(
                                        "options.allow_close_time.close_time"
                                    )}
                                    label={{
                                        text: "Close time",
                                    }}
                                />
                            </div>
                        )}
                        <Checkbox
                            label={{
                                text: "Allow view submission after test",
                            }}
                            {...register(
                                "options.allow_view_submission_after_test.enable"
                            )}
                        />
                        <Checkbox
                            label={{ text: "Allow multiple submissions" }}
                            {...register(
                                "options.allow_multiple_submissions.enable"
                            )}
                        />
                        {options.allow_multiple_submissions.enable && (
                            <div className="grid grid-cols-[2fr_5fr] px-4 py-2 bg-orange-50">
                                <Input
                                    type="number"
                                    {...register(
                                        "options.allow_multiple_submissions.maximum_submissions"
                                    )}
                                    label={{
                                        text: "Maximum submissions",
                                    }}
                                />
                            </div>
                        )}
                        <Checkbox
                            label={{ text: "Allow save progress" }}
                            {...register("options.allow_save_progress.enable")}
                        />
                        <Checkbox
                            label={{
                                text: "Allow showing taker's answers after test",
                            }}
                            {...register(
                                "options.allow_show_taker_answers_after_test.enable"
                            )}
                        />
                        <Checkbox
                            label={{
                                text: "Allow showing maker's answers after test",
                            }}
                            {...register(
                                "options.allow_show_maker_answers_after_test.enable"
                            )}
                        />
                        {options.allow_show_maker_answers_after_test.enable && (
                            <div className="grid grid-cols-[2fr_5fr] gap-2 px-4 py-2 bg-orange-50">
                                <Select
                                    className="w-0 grow capitalize"
                                    {...register(
                                        "options.allow_show_maker_answers_after_test.public_answers_option",
                                        {
                                            required:
                                                "Public answers option is required",
                                        }
                                    )}
                                    label={{
                                        text: "Public answers options",
                                    }}
                                    options={Object.values(
                                        PUBLIC_ANSWERS_OPTIONS
                                    ).map((publicAnswersOption) => ({
                                        label: PUBLIC_ANSWERS_OPTIONS_LABEL[
                                            publicAnswersOption
                                        ],
                                        value: publicAnswersOption,
                                    }))}
                                />

                                {options.allow_show_maker_answers_after_test
                                    .public_answers_option ===
                                    PUBLIC_ANSWERS_OPTIONS.SPECIFIC_DATE && (
                                    <Input
                                        type="datetime-local"
                                        label={{
                                            text: "Public answers date",
                                        }}
                                        {...register(
                                            "options.allow_show_maker_answers_after_test.public_answers_date",
                                            {
                                                required:
                                                    "Public answers date is required",
                                            }
                                        )}
                                    />
                                )}
                            </div>
                        )}
                        <Checkbox
                            label={{ text: "Allow shuffling questions" }}
                            {...register(
                                "options.allow_shuffle_questions.enable"
                            )}
                        />
                        <Checkbox
                            label={{ text: "Allow shuffling answers" }}
                            {...register(
                                "options.allow_shuffle_answers.enable"
                            )}
                        />
                        <Checkbox
                            label={{
                                text: "Allow review before submission",
                            }}
                            {...register(
                                "options.allow_review_before_submission.enable"
                            )}
                        />
                        <Checkbox
                            label={{ text: "Disallow time limit" }}
                            {...register("options.disallow_time_limit.enable")}
                        />
                    </div>
                </Accordion>
            </form>
        </Wrapper>
    );
};

export default TestInfo;
