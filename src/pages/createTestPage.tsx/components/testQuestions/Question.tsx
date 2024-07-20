import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
    FillGapsQuestionBodyItf,
    MatchingQuestionBodyItf,
    MultipleChoiceQuestionBodyItf,
    QuestionBodyContentItf,
    QuestionBodyItf,
    QuestionItf,
    ResponseQuestionBodyItf,
    TestPartItf,
} from "../../../../types/types";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../../components/modals/Modal";
import { questionTypes, testLevels } from "../../../../config/config";
import MulitpleChoiceQuestion from "./MultipleChoicesQuestion";
import FillGapsQuestion from "./FillGapsQuestion";
import MatchingQuestion from "./MatchingQuestion";
import { useMutation } from "react-query";
import { saveQuestion } from "../../../../services/test";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { questionTypeToQuestionSchema } from "../../../../utils/mapping";
import ResponseQuestion from "./ResponseQuestion";
import Button from "../../../../components/elements/Button";
import Input from "../../../../components/elements/Input";
import Select from "../../../../components/elements/Select";
import { Control, useForm, UseFormRegister } from "react-hook-form";

type QuestionProps = {
    question: QuestionItf | null;
    part?: TestPartItf;
    index: number;
    testId: string;
    onAfterUpdate: () => void;
};

const Question = ({
    question,
    onAfterUpdate,
    testId,
    part,
    index,
}: QuestionProps) => {
    const [open, setOpen] = useState<boolean>(false);

    const getInitialContent = useCallback(
        (questionType: (typeof questionTypes)[keyof typeof questionTypes]) => {
            switch (questionType) {
                case questionTypes.MULITPLE_CHOICES:
                    return {
                        allow_multiple: false,
                        options: [{ text: "" }, { text: "" }],
                        text: "",
                        images: null,
                    };
                case questionTypes.FILL_GAPS:
                    return {
                        text: "",
                        num_gaps: 1,
                    };
                case questionTypes.MATCHING:
                    return {
                        text: "",
                        left_items: [{ text: "" }, { text: "" }],
                        right_items: [{ text: "" }, { text: "" }],
                    };
                case questionTypes.RESPONSE:
                    return {
                        text: "",
                        min_length: 1,
                        max_length: 1,
                    };
            }
        },
        []
    );

    const initialValues = useMemo(() => {
        const shared = {
            score: 1,
            level: testLevels.NONE,
            type: question ? question.type : questionTypes.MULITPLE_CHOICES,
            content: getInitialContent(
                question ? question.type : questionTypes.MULITPLE_CHOICES
            ),
            order: index + 1,
        };
        if (question) {
            return question;
        }
        if (!part) return shared;

        return {
            ...shared,
            part_id: part._id,
        };
    }, [question, part]);

    const {
        handleSubmit,
        formState: { errors },
        register,
        setValue,
        watch,
        control,
    } = useForm<QuestionBodyItf<QuestionBodyContentItf>>({
        defaultValues: initialValues,
    });

    const content = watch("content");
    const type = watch("type");
    const order = watch("order");

    const handleContentChange = (
        content:
            | MultipleChoiceQuestionBodyItf
            | FillGapsQuestionBodyItf
            | MatchingQuestionBodyItf
            | ResponseQuestionBodyItf
    ) => {
        setValue("content", content);
    };

    useEffect(() => {
        if (question && question.type === type)
            setValue("content", question.content);

        switch (type) {
            case questionTypes.MULITPLE_CHOICES:
                setValue(
                    "content",
                    getInitialContent(type) as MultipleChoiceQuestionBodyItf
                );
                break;
            case questionTypes.FILL_GAPS:
                setValue(
                    "content",
                    getInitialContent(type) as FillGapsQuestionBodyItf
                );
                break;
            case questionTypes.MATCHING:
                setValue(
                    "content",
                    getInitialContent(type) as MatchingQuestionBodyItf
                );
                break;
            case questionTypes.RESPONSE:
                setValue(
                    "content",
                    getInitialContent(type) as ResponseQuestionBodyItf
                );
                break;
        }
    }, [type]);

    const { mutate: createQuestionMutate, isLoading: createQuestionLoading } =
        useMutation({
            mutationFn: async (
                questionBody: QuestionBodyItf<QuestionBodyContentItf>
            ) => await saveQuestion(testId, questionBody),
            mutationKey: ["create-question"],
            onSuccess: (data) => {
                toast.success("Create question successfuly");
                setOpen(false);
                onAfterUpdate();
            },
            onError: (err) => {
                if (err instanceof AxiosError) {
                    toast.error(err.response?.data.message);
                }
            },
        });

    const { mutate: updateQuestionMutate, isLoading: updateQuestionLoading } =
        useMutation({
            mutationFn: async (
                questionBody: QuestionBodyItf<QuestionBodyContentItf>
            ) => await saveQuestion(testId, questionBody, question!._id),
            mutationKey: ["update-question", { questionId: question?._id }],
            onSuccess: (data) => {
                toast.success("Update question successfuly");
                setOpen(false);
                onAfterUpdate();
            },
            onError: (err) => {
                if (err instanceof AxiosError) {
                    toast.error(err.response?.data.message);
                }
            },
        });

    const onSubmit = (data: QuestionBodyItf<QuestionBodyContentItf>) => {
        if (!question) {
            createQuestionMutate(data);
        } else {
            updateQuestionMutate(data);
        }
    };

    return (
        <>
            <div
                className={`bg-orange-100 p-2 text-center cursor-pointer hover:bg-orange-200 ${
                    question && "border border-orange-500"
                }`}
                onClick={() => setOpen(true)}
            >
                Question {order}
            </div>
            {open && (
                <Modal onClose={() => setOpen(false)}>
                    <ModalHeader title={`Question ${order}`} />
                    <ModalBody>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="w-[600px]"
                        >
                            <div className="flex gap-4">
                                <div className="space-y-4 gap-4 w-1/3 shrink-0">
                                    <div className="flex items-end gap-2">
                                        <label
                                            htmlFor="score"
                                            className="w-1/5"
                                        >
                                            Score:{" "}
                                        </label>
                                        <Input
                                            type="number"
                                            min={0}
                                            {...register("score", {
                                                required: "Score is required",
                                                min: {
                                                    value: 0.01,
                                                    message:
                                                        "Score must be greater than 0",
                                                },
                                            })}
                                            error={
                                                errors?.score &&
                                                errors?.score.message
                                            }
                                        />
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <label
                                            htmlFor="level"
                                            className="w-1/5"
                                        >
                                            Level:{" "}
                                        </label>
                                        <Select
                                            className="grow capitalize"
                                            {...register("level")}
                                            options={Object.values(
                                                testLevels
                                            ).map((level) => ({
                                                label: level,
                                                value: level,
                                            }))}
                                        />
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <label htmlFor="type" className="w-1/5">
                                            Type:{" "}
                                        </label>
                                        <Select
                                            className="grow capitalize"
                                            {...register("type", {
                                                required: "Type is required",
                                                onChange(event) {
                                                    setValue("content", null);
                                                    setValue(
                                                        "type",
                                                        event.target.value
                                                    );
                                                },
                                            })}
                                            options={Object.values(
                                                questionTypes
                                            ).map((type) => ({
                                                label: type,
                                                value: type,
                                            }))}
                                        />
                                    </div>
                                </div>
                                <div className="grow overflow-hidden">
                                    {content &&
                                        type ===
                                            questionTypes.MULITPLE_CHOICES && (
                                            <MulitpleChoiceQuestion
                                                content={
                                                    content as MultipleChoiceQuestionBodyItf
                                                }
                                                control={
                                                    control as Control<
                                                        QuestionBodyItf<MultipleChoiceQuestionBodyItf>
                                                    >
                                                }
                                                errors={errors}
                                                register={
                                                    register as UseFormRegister<
                                                        QuestionBodyItf<MultipleChoiceQuestionBodyItf>
                                                    >
                                                }
                                            />
                                        )}
                                    {content &&
                                        type === questionTypes.FILL_GAPS && (
                                            <FillGapsQuestion
                                                content={
                                                    content as FillGapsQuestionBodyItf
                                                }
                                                onContentChange={
                                                    handleContentChange
                                                }
                                            />
                                        )}
                                    {content &&
                                        type === questionTypes.MATCHING && (
                                            <MatchingQuestion
                                                content={
                                                    content as MatchingQuestionBodyItf
                                                }
                                                control={
                                                    control as Control<
                                                        QuestionBodyItf<MatchingQuestionBodyItf>
                                                    >
                                                }
                                                errors={errors}
                                                register={
                                                    register as UseFormRegister<
                                                        QuestionBodyItf<MatchingQuestionBodyItf>
                                                    >
                                                }
                                            />
                                        )}
                                    {content &&
                                        type === questionTypes.RESPONSE && (
                                            <ResponseQuestion
                                                content={
                                                    content as ResponseQuestionBodyItf
                                                }
                                                onContentChange={
                                                    handleContentChange
                                                }
                                            />
                                        )}
                                </div>
                            </div>

                            <div className="flex justify-end mt-4 gap-2">
                                <Button
                                    primary={false}
                                    type="button"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={
                                        createQuestionLoading ||
                                        updateQuestionLoading
                                    }
                                    type="submit"
                                >
                                    {!(
                                        createQuestionLoading ||
                                        updateQuestionLoading
                                    )
                                        ? "Save"
                                        : "Saving..."}
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </Modal>
            )}
        </>
    );
};

export default Question;
