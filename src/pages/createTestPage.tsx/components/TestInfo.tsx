import { useEffect, useMemo } from "react";
import {
    PUBLIC_ANSWERS_OPTIONS,
    TEST_LEVEL,
    TEST_LEVEL_LABEL,
} from "../../../config/constants/tests";
import { TestBodyItf } from "../../../types/types";
import { formatTimezone } from "../../../utils/time";
import Input from "../../../components/elements/Input";
import Select from "../../../components/elements/Select";
import { FormProvider, useForm } from "react-hook-form";
import Wrapper from "../../../components/wrappers/Wrapper";
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

    const methods = useForm<TestBodyItf>({
        defaultValues: initialValues,
    });

    const {
        handleSubmit,
        formState: { errors },
        register,
        setValue,
        watch,
    } = methods;

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
            <FormProvider {...methods}>
                <form className="mt-4 ">
                    <div className="grid grid-cols-[2fr_5fr] gap-2">
                        <Input
                            {...register("title", {
                                required: "Title is required",
                            })}
                            error={errors?.title && errors?.title.message}
                            required
                            disabled={!editibility.TEST_INFORMATION.title}
                            label={{
                                text: "Test title",
                            }}
                        />
                        <Input
                            {...register("description")}
                            label={{ text: "Test description" }}
                            disabled={!editibility.TEST_INFORMATION.description}
                        />
                        <Input
                            type="datetime-local"
                            {...register("datetime", {
                                required: "Start time is required",
                            })}
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
                                    value: 1,
                                    message:
                                        "Number of parts must be greater than 0",
                                },
                                valueAsNumber: true,
                            })}
                            required
                            error={
                                errors?.num_parts && errors?.num_parts.message
                            }
                            label={{ text: "Number of parts" }}
                            disabled={!editibility.TEST_INFORMATION.num_parts}
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
                            disabled={
                                !editibility.TEST_INFORMATION.num_questions
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
                            disabled={!editibility.TEST_INFORMATION.level}
                        />
                    </div>
                    <TestOptions />
                </form>
            </FormProvider>
        </Wrapper>
    );
};

export default TestInfo;
