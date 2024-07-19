import { useEffect, useMemo } from "react";
import { publicAnswersOptions, testLevels } from "../../../config/config";
import { TestBodyItf, TestItf } from "../../../types/types";
import { createTest, updateTest } from "../../../services/test";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { formatTimezone } from "../../../utils/time";
import Button from "../../../components/elements/Button";
import Input from "../../../components/elements/Input";
import Select from "../../../components/elements/Select";
import { useForm } from "react-hook-form";

type SectionProps = {
    test: TestItf | null;
    onAfterUpdate: (testId: string) => void;
    onBack: () => void;
    onNext: () => void;
};

const TestInfo = ({ test, onAfterUpdate, onNext, onBack }: SectionProps) => {
    const initialValues: TestBodyItf = useMemo(
        () =>
            !test
                ? {
                      title: "",
                      datetime: formatTimezone(new Date()),
                      description: "",
                      duration: 0,
                      max_score: 10,
                      num_questions: 0,
                      level: testLevels.EASY,
                      num_parts: 1,
                      enable_close_time: true,
                      close_time: formatTimezone(new Date()),
                      code: "",
                      public_answers_option: publicAnswersOptions.SPECIFIC_DATE,
                      public_answers_date: formatTimezone(new Date()),
                  }
                : {
                      ...test,
                  },
        [test]
    );

    const { mutate: createTestMutate, isLoading: createTestLoading } =
        useMutation({
            mutationFn: async (testBody: TestBodyItf) =>
                await createTest(testBody),
            mutationKey: ["create-test"],
            onSuccess: (data) => {
                onAfterUpdate(data.test._id);
                onNext();
            },
            onError: (err) => {
                if (err instanceof AxiosError) {
                    toast.error(err.response?.data.message);
                }
            },
        });

    const { mutate: updateTestMutate, isLoading: updateTestLoading } =
        useMutation({
            mutationFn: async (testBody: TestBodyItf) =>
                await updateTest(test!._id, testBody),
            mutationKey: ["update-test", { testId: test?._id }],
            onSuccess: (data) => {
                onNext();
            },
            onError: (err) => {
                if (err instanceof AxiosError) {
                    toast.error(err.response?.data.message);
                }
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
        if (test) {
            updateTestMutate(data);
        } else {
            createTestMutate(data);
        }
    };

    const startTime = watch("datetime");

    useEffect(() => {
        const formattedStartTime = formatTimezone(new Date(startTime));
        setValue("datetime", formattedStartTime);
        setValue("close_time", startTime);
        setValue("public_answers_date", startTime);
    }, [startTime]);

    const publicAnswersOption = watch("public_answers_option");
    const closeTime = watch("close_time");
    const enableCloseTime = watch("enable_close_time");

    useEffect(() => {
        if (
            publicAnswersOption === publicAnswersOptions.AFTER_CLOSE_TIME &&
            enableCloseTime
        ) {
            setValue("public_answers_date", closeTime);
        }
    }, [publicAnswersOption, enableCloseTime, closeTime]);

    return (
        <div className="px-20 py-12 shadow-2xl">
            <h2 className="text-center text-3xl">Test Information</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 ">
                <div className="flex gap-4 items-end">
                    <label htmlFor="title" className="w-1/5">
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
                    <label htmlFor="description" className="w-1/5">
                        Test description:{" "}
                    </label>
                    <Input {...register("description")} />
                </div>
                <div className="flex gap-4 items-end mt-4">
                    <label htmlFor="datetime" className="w-1/5">
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
                    <div className="w-1/5">
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
                        options={Object.values(testLevels).map((level) => ({
                            label: level,
                            value: level,
                        }))}
                    />
                </div>

                <div className="flex gap-4 items-end mt-4">
                    <label
                        htmlFor="public_answers_option"
                        className="w-1/5 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                        Public answers options:{" "}
                    </label>
                    <Select
                        className="w-0 grow capitalize"
                        {...register("public_answers_option", {
                            required: "Public answers option is required",
                        })}
                        options={Object.values(publicAnswersOptions).map(
                            (publicAnswersOption) => ({
                                label: publicAnswersOption,
                                value: publicAnswersOption,
                            })
                        )}
                    />
                </div>

                {publicAnswersOption === publicAnswersOptions.SPECIFIC_DATE && (
                    <div className="flex gap-4 items-end mt-4">
                        <label
                            htmlFor="public_answers_date"
                            className="w-1/5 whitespace-nowrap overflow-hidden text-ellipsis"
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

                <div className="flex justify-end items-center gap-3 mt-6 pt-4 border-t border-gray-300">
                    <Button size="lg" disabled>
                        Back
                    </Button>
                    <Button
                        size="lg"
                        type="submit"
                        disabled={createTestLoading || updateTestLoading}
                    >
                        {!(createTestLoading || updateTestLoading)
                            ? "Next"
                            : "Saving..."}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default TestInfo;
