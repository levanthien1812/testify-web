import { useEffect, useMemo } from "react";
import { PUBLIC_ANSWERS_OPTIONS, TEST_LEVEL } from "../../../config/config";
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
        closeTime,
        code,
        enableCloseTime,
        numParts,
        numQuestions,
        maxScore,
        publicAnswersDate,
        publicAnswersOption,
        isValidTestInfo,
    } = useSelector((state: RootState) => state.createTest);
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
            code: code,
            enable_close_time: enableCloseTime,
            close_time: closeTime,
            public_answers_option: publicAnswersOption,
            public_answers_date: publicAnswersDate,
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
            code,
            enableCloseTime,
            closeTime,
            publicAnswersDate,
            publicAnswersOption,
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
        setValue("close_time", allValues?.datetime);
        setValue("public_answers_date", allValues?.datetime);
    }, [allValues?.datetime, setValue]);

    useEffect(() => {
        dispatch(saveTestInfo(allValues));
        dispatch(validateTest());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(allValues), dispatch, saveTestInfo, validateTest]);

    useEffect(() => {
        if (
            allValues?.public_answers_option ===
                PUBLIC_ANSWERS_OPTIONS.AFTER_CLOSE_TIME &&
            allValues?.enable_close_time === true &&
            allValues?.close_time
        ) {
            setValue("public_answers_date", allValues?.close_time);
        }
    }, [
        allValues?.public_answers_option,
        allValues?.enable_close_time,
        allValues?.close_time,
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
                <div className="flex gap-4 items-end">
                    <label htmlFor="title" className="w-1/5 shrink-0">
                        Test title:{" "}
                    </label>
                    <Input
                        {...register("title", {
                            required: "Title is required",
                        })}
                        error={errors?.title && errors?.title.message}
                    />
                </div>
                <div className="flex gap-4 items-end mt-4">
                    <label htmlFor="description" className="w-1/5 shrink-0">
                        Test description:{" "}
                    </label>
                    <Input {...register("description")} />
                </div>
                <div className="flex gap-4 items-end mt-4">
                    <label htmlFor="datetime" className="w-1/5 shrink-0">
                        Start time:{" "}
                    </label>
                    <Input
                        type="datetime-local"
                        {...register("datetime", {
                            required: "Start time is required",
                        })}
                        error={errors?.datetime && errors?.datetime.message}
                    />
                </div>
                <div className="flex gap-4 items-end mt-4">
                    <label htmlFor="duration" className="w-1/5 shrink-0">
                        Duration (mins):{" "}
                    </label>
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
                        error={errors?.duration && errors?.duration.message}
                    />
                    <label htmlFor="max_score" className="w-1/5 shrink-0">
                        Max score:{" "}
                    </label>
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
                        error={errors?.max_score && errors?.max_score.message}
                    />
                </div>
                <div className="flex gap-4 items-end mt-4">
                    <div className="w-1/5 shrink-0">
                        <label htmlFor="datetime">Close time: </label>
                        <input
                            type="checkbox"
                            {...register("enable_close_time")}
                        />
                    </div>

                    <Input
                        type="datetime-local"
                        {...register("close_time")}
                        disabled={!enableCloseTime}
                    />
                </div>
                <div className="flex gap-4 items-end mt-4">
                    <label htmlFor="num_parts" className="w-1/5 shrink-0">
                        Number of parts:{" "}
                    </label>
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
                        error={errors?.num_parts && errors?.num_parts.message}
                    />
                    <label htmlFor="num_questions" className="w-1/5 shrink-0">
                        Num of questions:{" "}
                    </label>
                    <Input
                        type="number"
                        step={1}
                        {...register("num_questions", {
                            required: "Number of questions is required",
                            min: {
                                value: 1,
                                message:
                                    "Number of questions must be greater than 0",
                            },
                            valueAsNumber: true,
                        })}
                        error={
                            errors?.num_questions &&
                            errors?.num_questions.message
                        }
                    />
                </div>
                <div className="flex gap-4 items-end mt-4">
                    <label htmlFor="code" className="w-1/5 shrink-0">
                        Test code:{" "}
                    </label>
                    <Input {...register("code")} />
                    <label htmlFor="level" className="w-1/5 shrink-0">
                        Level:{" "}
                    </label>
                    <Select
                        className="grow capitalize"
                        {...register("level")}
                        options={Object.values(TEST_LEVEL).map((level) => ({
                            label: level,
                            value: level,
                        }))}
                    />
                </div>

                <div className="flex gap-4 items-end mt-4">
                    <label
                        htmlFor="public_answers_option"
                        className="w-1/5 shrink-0 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                        Public answers options:{" "}
                    </label>
                    <Select
                        className="w-0 grow capitalize"
                        {...register("public_answers_option", {
                            required: "Public answers option is required",
                        })}
                        options={Object.values(PUBLIC_ANSWERS_OPTIONS).map(
                            (publicAnswersOption) => ({
                                label: publicAnswersOption,
                                value: publicAnswersOption,
                            })
                        )}
                    />
                </div>

                {publicAnswersOption ===
                    PUBLIC_ANSWERS_OPTIONS.SPECIFIC_DATE && (
                    <div className="flex gap-4 items-end mt-4">
                        <label
                            htmlFor="public_answers_date"
                            className="w-1/5 shrink-0 whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                            Public answers date:{" "}
                        </label>
                        <Input
                            type="datetime-local"
                            {...register("public_answers_date", {
                                required: "Public answers date is required",
                            })}
                        />
                    </div>
                )}
            </form>
        </Wrapper>
    );
};

export default TestInfo;
