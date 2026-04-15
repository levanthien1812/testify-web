import { useEffect, useMemo, useRef } from "react";
import {
    PUBLIC_ANSWERS_OPTIONS,
    QUESTION_NUMBERING_METHOD,
    QUESTION_NUMBERING_METHOD_LABEL,
    TEST_LEVEL,
    TEST_LEVEL_LABEL,
} from "../../../config/constants/tests";
import { TestBodyItf } from "../../../types/types";
import { formatTimezone } from "../../../utils/time";
import Input from "../../../components/elements/Input";
import Select from "../../../components/elements/Select";
import { FormProvider, useForm } from "react-hook-form";
import Wrapper from "./Wrapper";
import { createTestActions } from "../../../stores/createTest";
import { useMutation } from "react-query";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import { createTest, updateTest } from "../../../services/test";
import { useDispatch } from "react-redux";
import TestOptions from "./testInfo/TestOptions";
import { useAppSelector } from "../../../hooks/hooks";

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
        editibility,
        testParts,
    } = useAppSelector((state) => state.createTest);

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
        ],
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

    const methods = useForm<TestBodyItf>({
        defaultValues: initialValues,
    });

    const {
        handleSubmit,
        formState: { errors },
        register,
        setValue,
        reset,
        watch,
        getValues,
    } = methods;

    const onSubmit = async (data: TestBodyItf) => {
        // Save to Redux before creating/updating
        dispatch(saveTestInfo(data));
        dispatch(validateTest());

        if (!testId) createTestMutate(data);
        else updateTestMutate(data);
    };

    const handleFieldBlur = () => {
        const values = getValues();
        dispatch(saveTestInfo(values));
        dispatch(validateTest());
    };

    const allValues = watch();

    useEffect(() => {
        // When navigating back to an existing test, the form needs to be reset with the fetched data.
        reset(
            initialValues,
            { keepDefaultValues: false }, // Ensure defaultValues are updated
        );
    }, [initialValues, reset]);

    useEffect(() => {
        // const formattedStartTime = formatTimezone(
        //     new Date(allValues?.datetime)
        // );

        // setValue("datetime", formattedStartTime);
        if (options.allow_close_time.enable)
            setValue(
                "options.allow_close_time.close_time",
                allValues?.datetime,
            );
        if (options.allow_show_maker_answers_after_test.enable)
            setValue(
                "options.allow_show_maker_answers_after_test.public_answers_date",
                allValues?.datetime,
            );
    }, [
        allValues?.datetime,
        setValue,
        options.allow_close_time.enable,
        options.allow_show_maker_answers_after_test.enable,
    ]);

    useEffect(() => {
        setValue("datetime", formatTimezone(new Date(testDatetime)));
    }, [testDatetime, setValue]);

    useEffect(() => {
        if (
            allValues?.options.allow_show_maker_answers_after_test.enable &&
            allValues?.options.allow_show_maker_answers_after_test
                .public_answers_option ===
                PUBLIC_ANSWERS_OPTIONS.AFTER_CLOSE_TIME &&
            allValues?.options.allow_close_time.enable &&
            allValues?.options.allow_close_time.close_time
        ) {
            setValue(
                "options.allow_show_maker_answers_after_test.public_answers_date",
                allValues?.options.allow_close_time.close_time,
            );
        }
    }, [
        allValues?.options.allow_show_maker_answers_after_test.enable,
        allValues?.options.allow_show_maker_answers_after_test
            .public_answers_option,
        allValues?.options.allow_close_time.enable,
        allValues?.options.allow_close_time.close_time,
        setValue,
    ]);

    useEffect(() => {
        if (
            allValues.num_parts > 1 &&
            allValues.num_questions < allValues.num_parts
        ) {
            setValue("num_questions", allValues.num_parts);
        }
    }, [allValues.num_parts, allValues.num_questions, setValue]);

    useEffect(() => {
        if (allValues.options.require_screen_recorder.enable) {
            setValue(
                "options.require_screen_recorder.record_mode",
                allValues.options.require_camera_on.record_mode,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        allValues.options.require_camera_on.record_mode,
        allValues.options.require_screen_recorder.enable,
    ]);

    useEffect(() => {
        if (allValues.options.require_camera_on.enable) {
            setValue(
                "options.require_camera_on.record_mode",
                allValues.options.require_screen_recorder.record_mode,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        allValues.options.require_screen_recorder.record_mode,
        allValues.options.require_camera_on.enable,
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
            <FormProvider {...methods}>
                <form className="mt-4 ">
                    <div className="grid grid-cols-1 sm:grid-cols-[2fr_5fr] gap-2">
                        <Input
                            {...register("title", {
                                required: "Title is required",
                            })}
                            onBlur={handleFieldBlur}
                            error={errors?.title && errors?.title.message}
                            required
                            disabled={!editibility.TEST_INFORMATION.title}
                            label={{
                                text: "Test title",
                            }}
                        />
                        <Input
                            {...register("description")}
                            onBlur={handleFieldBlur}
                            label={{ text: "Test description" }}
                            disabled={!editibility.TEST_INFORMATION.description}
                        />
                        <Input
                            type="datetime-local"
                            {...register("datetime", {
                                required: "Start time is required",
                                validate: (value) => {
                                    if (!editibility.TEST_INFORMATION.datetime)
                                        return true;
                                    const date = new Date(value);
                                    if (date < new Date()) {
                                        return "Start time must be in the future";
                                    }
                                    return true;
                                },
                            })}
                            onBlur={handleFieldBlur}
                            error={errors?.datetime && errors?.datetime.message}
                            label={{ text: "Start time" }}
                            disabled={!editibility.TEST_INFORMATION.datetime}
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
                            min={1}
                            onBlur={handleFieldBlur}
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
                            min={1}
                            onBlur={handleFieldBlur}
                            required
                            error={
                                errors?.max_score && errors?.max_score.message
                            }
                            label={{ text: "Max score" }}
                            disabled={!editibility.TEST_INFORMATION.max_score}
                        />
                        <Input
                            type="number"
                            step={1}
                            {...register("num_parts", {
                                required: "Number of parts is required",
                                min: {
                                    value: 0,
                                    message:
                                        "Number of parts must be greater than  or equal to 0",
                                },
                                validate: (value) => {
                                    if (value === 1)
                                        return "Number of parts must be 0 or greater than 1";
                                },
                                valueAsNumber: true,
                            })}
                            min={0}
                            onBlur={handleFieldBlur}
                            required
                            error={
                                errors?.num_parts && errors?.num_parts.message
                            }
                            label={{ text: "Number of parts" }}
                            disabled={!editibility.TEST_INFORMATION.num_parts}
                            helperText={`Number of parts must be 0 or greater than 1. 
                                ${
                                    numParts > 1 && testParts.length >= 1
                                        ? "Be carefull when update number of parts because you already provided data for parts before!"
                                        : ""
                                }`}
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
                            onBlur={handleFieldBlur}
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
                            disabled={
                                !editibility.TEST_INFORMATION.num_questions
                            }
                        />
                        {numParts > 1 && (
                            <Select
                                className="grow capitalize"
                                {...register("question_numbering_method")}
                                onBlur={handleFieldBlur}
                                options={Object.values(
                                    QUESTION_NUMBERING_METHOD,
                                ).map((method) => ({
                                    label: QUESTION_NUMBERING_METHOD_LABEL[
                                        method
                                    ],
                                    value: method,
                                }))}
                                label={{
                                    text: "Question numbering method",
                                }}
                                disabled={!editibility.TEST_INFORMATION.level}
                            />
                        )}
                        <Select
                            className="grow capitalize"
                            {...register("level")}
                            onBlur={handleFieldBlur}
                            options={Object.values(TEST_LEVEL).map((level) => ({
                                label: TEST_LEVEL_LABEL[level],
                                value: level,
                            }))}
                            label={{
                                text: "Level",
                            }}
                            disabled={!editibility.TEST_INFORMATION.level}
                        />
                    </div>
                    <div id="test-options-section">
                        <TestOptions />
                    </div>
                </form>
            </FormProvider>
        </Wrapper>
    );
};

export default TestInfo;
