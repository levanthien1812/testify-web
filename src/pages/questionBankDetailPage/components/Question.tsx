import { useEffect, useRef, useState } from "react";
import {
    QuestionBankItf,
    QuestionInBankItf,
} from "../../../types/questionBank";
import {
    FillGapsQuestionBodyItf,
    MatchingQuestionBodyItf,
    MultipleChoiceQuestionBodyItf,
    QuestionBodyContentItf,
    QuestionBodyItf,
    QuestionContentItf,
    ResponseQuestionBodyItf,
    TrueFalseQuestionBodyItf,
} from "../../../types/types";
import { Control, useForm, UseFormSetValue } from "react-hook-form";
import { getInitialQuestionContent } from "../../../utils/mapping";
import { useMutation } from "react-query";
import {
    createQuestion,
    deleteQuestion,
    updateQuestion,
} from "../../../services/questionBank";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import { toast } from "react-toastify";
import { TOAST_MESSAGES } from "../../../config/constants/toasts";
import Modal, {
    ModalBody,
    ModalHeader,
} from "../../../components/modals/Modal";
import Input from "../../../components/elements/Input";
import {
    QUESTION_TYPE,
    QUESTION_TYPE_LABEL,
    TEST_LEVEL,
    TEST_LEVEL_LABEL,
} from "../../../config/constants/tests";
import Select from "../../../components/elements/Select";
import Button from "../../../components/elements/Button";
import MulitpleChoiceQuestion from "../../createTestPage/components/testQuestions/MultipleChoicesQuestion";
import ConfirmModal from "../../../components/modals/ConfirmModal";
import TrueFalseQuestion from "../../createTestPage/components/testQuestions/TrueFalseQuestion";
import ResponseQuestion from "../../createTestPage/components/testQuestions/ResponseQuestion";
import MatchingQuestion from "../../createTestPage/components/testQuestions/MatchingQuestion";
import FillGapsQuestion from "../../createTestPage/components/testQuestions/FillGapsQuestion";

type QuestionProps = {
    question: QuestionInBankItf<QuestionContentItf>;
    questionBank: QuestionBankItf;
};

const Question = ({ question, questionBank }: QuestionProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [isDeletingQuestion, setIsDeletingQuestion] =
        useState<boolean>(false);
    const audioElement = useRef<HTMLAudioElement>(null);

    const {
        handleSubmit,
        formState: { errors },
        register,
        setValue,
        watch,
        control,
    } = useForm<QuestionBodyItf<QuestionBodyContentItf>>({
        defaultValues: question,
    });

    const allValues = watch();

    useEffect(() => {
        if (!question?.id && allValues?.type !== question.type) {
            setValue("content", getInitialQuestionContent(allValues?.type));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allValues?.type]);

    const { mutate: createQuestionMutate, isLoading: createQuestionLoading } =
        useMutation({
            mutationFn: async (
                questionBody: QuestionBodyItf<QuestionBodyContentItf>
            ) => await createQuestion(questionBank.id, questionBody),
            mutationKey: [MUTATION_KEYS.CREATE_QUESTION_IN_BANK],
            onSuccess: (data) => {
                toast.success(TOAST_MESSAGES.CREATE_QUESTION_SUCCESSFULLY);
                setOpen(false);
            },
        });

    const { mutate: deleteQuestionMutate, isLoading: deleteQuestionLoading } =
        useMutation({
            mutationFn: async () =>
                await deleteQuestion(questionBank.id, question.id!),
            mutationKey: [MUTATION_KEYS.DELETE_QUESTION],
            onSuccess: (data) => {
                toast.success(TOAST_MESSAGES.DELETE_QUESTION_SUCCESSFULLY);
                setIsDeletingQuestion(false);
            },
        });

    const { mutate: updateQuestionMutate, isLoading: updateQuestionLoading } =
        useMutation({
            mutationFn: async (
                questionBody: QuestionBodyItf<QuestionBodyContentItf>
            ) =>
                await updateQuestion(
                    questionBank.id,
                    question.id!,
                    questionBody
                ),
            mutationKey: [
                MUTATION_KEYS.UPDATE_QUESTION_IN_BANK,
                { questionId: question?.id },
            ],
            onSuccess: (data) => {
                toast.success(TOAST_MESSAGES.UPDATE_QUESTION_SUCCESSFULLY);
                setOpen(false);
            },
        });

    const onSubmit = (data: QuestionBodyItf<QuestionBodyContentItf>) => {
        if (!question?.id) {
            createQuestionMutate(data);
        } else {
            updateQuestionMutate(data);
        }
    };

    const handleClearContent = () => {
        setValue("content", getInitialQuestionContent(question?.type));
    };

    return (
        <>
            <audio
                ref={audioElement}
                src="/sounds/button_click_fast_wooden_organic.mp3"
                preload="auto"
            />
            {open && (
                <Modal onClose={() => setOpen(false)}>
                    <ModalHeader title={`Question ${question?.id}`} />
                    <ModalBody>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="w-[600px] relative"
                        >
                            <div className="flex gap-4">
                                <div className="space-y-2 w-1/3 shrink-0 flex flex-col">
                                    <div>
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
                                            label={{ text: "Score" }}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Select
                                            className="grow capitalize"
                                            {...register("type", {
                                                required: "Type is required",
                                                onChange(event) {
                                                    setValue(
                                                        "type",
                                                        event.target.value
                                                    );
                                                },
                                            })}
                                            options={Object.values(
                                                QUESTION_TYPE
                                            ).map((type) => ({
                                                label: QUESTION_TYPE_LABEL[
                                                    type
                                                ],
                                                value: type,
                                            }))}
                                            label={{ text: "Type" }}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Select
                                            className="grow capitalize"
                                            {...register("level")}
                                            options={Object.values(
                                                TEST_LEVEL
                                            ).map((level) => ({
                                                label: TEST_LEVEL_LABEL[level],
                                                value: level,
                                            }))}
                                            label={{ text: "Level" }}
                                        />
                                    </div>
                                    {question?.content && (
                                        <div className="grow flex flex-col justify-end">
                                            <Button
                                                secondary
                                                type="button"
                                                onClick={() =>
                                                    handleClearContent()
                                                }
                                                size="sm"
                                            >
                                                Clear content
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <div className="border-l border-gray-300 border-dashed"></div>
                                <div className="grow overflow-hidden">
                                    {question?.content &&
                                        question?.type ===
                                            QUESTION_TYPE.MULTIPLE_CHOICES && (
                                            <MulitpleChoiceQuestion
                                                content={
                                                    question?.content as MultipleChoiceQuestionBodyItf
                                                }
                                                control={
                                                    control as Control<
                                                        QuestionBodyItf<MultipleChoiceQuestionBodyItf>
                                                    >
                                                }
                                                errors={errors}
                                            />
                                        )}
                                    {question?.content &&
                                        question?.type ===
                                            QUESTION_TYPE.FILL_IN_THE_GAPS && (
                                            <FillGapsQuestion
                                                content={
                                                    question?.content as FillGapsQuestionBodyItf
                                                }
                                                control={
                                                    control as Control<
                                                        QuestionBodyItf<FillGapsQuestionBodyItf>
                                                    >
                                                }
                                                errors={errors}
                                                setValue={
                                                    setValue as UseFormSetValue<
                                                        QuestionBodyItf<FillGapsQuestionBodyItf>
                                                    >
                                                }
                                            />
                                        )}
                                    {question?.content &&
                                        question?.type ===
                                            QUESTION_TYPE.MATCHING && (
                                            <MatchingQuestion
                                                content={
                                                    question?.content as MatchingQuestionBodyItf
                                                }
                                                control={
                                                    control as Control<
                                                        QuestionBodyItf<MatchingQuestionBodyItf>
                                                    >
                                                }
                                                errors={errors}
                                            />
                                        )}
                                    {question?.content &&
                                        question?.type ===
                                            QUESTION_TYPE.RESPONSE && (
                                            <ResponseQuestion
                                                content={
                                                    question?.content as ResponseQuestionBodyItf
                                                }
                                                control={
                                                    control as Control<
                                                        QuestionBodyItf<ResponseQuestionBodyItf>
                                                    >
                                                }
                                                errors={errors}
                                            />
                                        )}
                                    {question?.content &&
                                        question?.type ===
                                            QUESTION_TYPE.TRUE_FALSE && (
                                            <TrueFalseQuestion
                                                content={
                                                    question?.content as TrueFalseQuestionBodyItf
                                                }
                                                control={
                                                    control as Control<
                                                        QuestionBodyItf<TrueFalseQuestionBodyItf>
                                                    >
                                                }
                                                errors={errors}
                                            />
                                        )}
                                </div>
                            </div>

                            <div className="flex justify-between mt-4 gap-2 border-t border-gray-300 pt-4">
                                <div className="flex gap-2">
                                    <Button
                                        secondary
                                        type="button"
                                        onClick={() =>
                                            setIsDeletingQuestion(true)
                                        }
                                        className="bg-red-500 text-white hover:bg-red-600"
                                    >
                                        Delete
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        secondary
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
                            </div>
                        </form>
                        {isDeletingQuestion && (
                            <ConfirmModal
                                message="Are you sure you want to delete this question? This action cannot be undone!"
                                onConfirm={() => {
                                    deleteQuestionMutate();
                                }}
                                onClose={() => setIsDeletingQuestion(false)}
                                title="Delete Question"
                                isConfirming={deleteQuestionLoading}
                            />
                        )}
                    </ModalBody>
                </Modal>
            )}
        </>
    );
};

export default Question;
