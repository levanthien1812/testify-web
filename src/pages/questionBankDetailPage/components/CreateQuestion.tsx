import { useEffect } from "react";
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
import { Control, useForm } from "react-hook-form";
import { getInitialQuestionContent } from "../../../utils/mapping";
import { useMutation } from "react-query";
import { createQuestion, updateQuestion } from "../../../services/questionBank";
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
import TrueFalseQuestion from "../../createTestPage/components/testQuestions/TrueFalseQuestion";
import ResponseQuestion from "../../createTestPage/components/testQuestions/ResponseQuestion";
import MatchingQuestion from "../../createTestPage/components/testQuestions/MatchingQuestion";
import FillGapsQuestion from "../../createTestPage/components/testQuestions/FillGapsQuestion";
import { INITIAL_QUESTION_IN_BANK } from "../../../config/constants/initialValues";

type CreateQuestionProps = {
    question?: QuestionInBankItf<QuestionContentItf>;
    questionBank: QuestionBankItf;
    onAfterCreate: () => void;
    onClose: () => void;
};

const CreateQuestion = ({
    question,
    questionBank,
    onAfterCreate,
    onClose,
}: CreateQuestionProps) => {
    const {
        handleSubmit,
        formState: { errors },
        register,
        setValue,
        watch,
        control,
    } = useForm<QuestionBodyItf<QuestionBodyContentItf>>({
        defaultValues: question || INITIAL_QUESTION_IN_BANK,
    });

    const allValues = watch();

    const { mutate: createQuestionMutate, isLoading: createQuestionLoading } =
        useMutation({
            mutationFn: async (
                questionBody: QuestionBodyItf<QuestionBodyContentItf>
            ) => await createQuestion(questionBank.id, questionBody),
            mutationKey: [MUTATION_KEYS.CREATE_QUESTION_IN_BANK],
            onSuccess: (data) => {
                toast.success(TOAST_MESSAGES.CREATE_QUESTION_SUCCESSFULLY);
                onAfterCreate();
                onClose();
            },
        });

    const { mutate: updateQuestionMutate, isLoading: updateQuestionLoading } =
        useMutation({
            mutationFn: async (
                questionBody: QuestionBodyItf<QuestionBodyContentItf>
            ) => {
                if (!question) return;
                await updateQuestion(
                    questionBank.id,
                    question.id!,
                    questionBody
                );
            },
            mutationKey: [
                MUTATION_KEYS.UPDATE_QUESTION_IN_BANK,
                { questionId: question },
            ],
            onSuccess: (data) => {
                toast.success(TOAST_MESSAGES.UPDATE_QUESTION_SUCCESSFULLY);
                onAfterCreate();
                onClose();
            },
        });

    const onSubmit = (data: QuestionBodyItf<QuestionBodyContentItf>) => {
        if (!question) {
            createQuestionMutate(data);
        } else {
            updateQuestionMutate(data);
        }
    };

    const handleClearContent = () => {
        if (!question) return;
        setValue("content", getInitialQuestionContent(allValues.type));
    };

    return (
        <Modal onClose={onClose}>
            <ModalHeader
                title={question ? "Edit Question" : "Create Question"}
            />
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
                                        errors?.score && errors?.score.message
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
                                            setValue(
                                                "content",
                                                getInitialQuestionContent(
                                                    event.target.value
                                                )
                                            );
                                        },
                                    })}
                                    options={Object.values(QUESTION_TYPE).map(
                                        (type) => ({
                                            label: QUESTION_TYPE_LABEL[type],
                                            value: type,
                                        })
                                    )}
                                    label={{ text: "Type" }}
                                    required
                                />
                            </div>
                            <div>
                                <Select
                                    className="grow capitalize"
                                    {...register("level")}
                                    options={Object.values(TEST_LEVEL).map(
                                        (level) => ({
                                            label: TEST_LEVEL_LABEL[level],
                                            value: level,
                                        })
                                    )}
                                    label={{ text: "Level" }}
                                />
                            </div>
                            {allValues.content && (
                                <div className="grow flex flex-col justify-end">
                                    <Button
                                        secondary
                                        type="button"
                                        onClick={() => handleClearContent()}
                                        size="sm"
                                    >
                                        Clear content
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="border-l border-gray-300 border-dashed"></div>
                        <div className="grow overflow-hidden">
                            {allValues.content &&
                                allValues.type ===
                                    QUESTION_TYPE.MULTIPLE_CHOICES && (
                                    <MulitpleChoiceQuestion
                                        content={
                                            allValues.content as MultipleChoiceQuestionBodyItf
                                        }
                                        control={
                                            control as Control<
                                                QuestionBodyItf<MultipleChoiceQuestionBodyItf>
                                            >
                                        }
                                        errors={errors}
                                    />
                                )}
                            {allValues.content &&
                                allValues.type ===
                                    QUESTION_TYPE.FILL_IN_THE_GAPS && (
                                    <FillGapsQuestion
                                        content={
                                            allValues.content as FillGapsQuestionBodyItf
                                        }
                                        control={
                                            control as Control<
                                                QuestionBodyItf<FillGapsQuestionBodyItf>
                                            >
                                        }
                                        errors={errors}
                                    />
                                )}
                            {allValues.content &&
                                allValues.type === QUESTION_TYPE.MATCHING && (
                                    <MatchingQuestion
                                        content={
                                            allValues.content as MatchingQuestionBodyItf
                                        }
                                        control={
                                            control as Control<
                                                QuestionBodyItf<MatchingQuestionBodyItf>
                                            >
                                        }
                                        errors={errors}
                                    />
                                )}
                            {allValues.content &&
                                allValues.type === QUESTION_TYPE.RESPONSE && (
                                    <ResponseQuestion
                                        content={
                                            allValues.content as ResponseQuestionBodyItf
                                        }
                                        control={
                                            control as Control<
                                                QuestionBodyItf<ResponseQuestionBodyItf>
                                            >
                                        }
                                        errors={errors}
                                    />
                                )}
                            {allValues.content &&
                                allValues.type === QUESTION_TYPE.TRUE_FALSE && (
                                    <TrueFalseQuestion
                                        content={
                                            allValues.content as TrueFalseQuestionBodyItf
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

                    <div className="flex mt-4 gap-2 border-t border-gray-300 pt-4">
                        <div className="flex gap-2 ml-auto">
                            <Button secondary type="button" onClick={onClose}>
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
                                    ? "Create"
                                    : "Creating..."}
                            </Button>
                        </div>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default CreateQuestion;
