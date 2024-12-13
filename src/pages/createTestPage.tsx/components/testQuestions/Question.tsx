import { useEffect, useState } from "react";
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
    ModalHeader,
} from "../../../../components/modals/Modal";
import MulitpleChoiceQuestion from "./MultipleChoicesQuestion";
import FillGapsQuestion from "./FillGapsQuestion";
import MatchingQuestion from "./MatchingQuestion";
import { useMutation } from "react-query";
import { saveQuestion } from "../../../../services/test";
import { toast } from "react-toastify";
import ResponseQuestion from "./ResponseQuestion";
import Button from "../../../../components/elements/Button";
import Input from "../../../../components/elements/Input";
import Select from "../../../../components/elements/Select";
import { Control, useForm, UseFormRegister } from "react-hook-form";
import { INITIAL_QUESTION } from "../../../../config/constants/initialValues";
import { useSelector } from "react-redux";
import { RootState } from "../../../../stores/rootState";
import { createTestActions } from "../../../../stores/createTest";
import { TOAST_MESSAGES } from "../../../../config/constants/toasts";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import { useDispatch } from "react-redux";
import { TEST_LEVEL } from "../../../../config/config";
import { QUESTION_TYPE } from "../../../../config/constants/tests";

type QuestionProps = {
    question: QuestionItf;
    part?: TestPartItf;
};

const Question = ({ question, part }: QuestionProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const { testId } = useSelector((state: RootState) => state.createTest);
    const { saveTestQuestions } = createTestActions;
    const dispatch = useDispatch();

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
        dispatch(
            saveTestQuestions({
                partId: part?.id,
                questionOrder: question.order,
                questionInfo: allValues,
            })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        JSON.stringify(allValues),
        part?.id,
        question?.order,
        saveTestQuestions,
        dispatch,
    ]);

    const { mutate: createQuestionMutate, isLoading: createQuestionLoading } =
        useMutation({
            mutationFn: async (
                questionBody: QuestionBodyItf<QuestionBodyContentItf>
            ) =>
                await saveQuestion(testId!, {
                    ...questionBody,
                    part_id: part?.id,
                }),
            mutationKey: [MUTATION_KEYS.CREATE_QUESTION],
            onSuccess: (data) => {
                toast.success(TOAST_MESSAGES.CREATE_QUESTION_SUCCESSFULLY);
                dispatch(
                    saveTestQuestions({
                        partId: part?.id,
                        questionOrder: question.order,
                        questionInfo: {
                            id: data?.question?.id,
                            is_saved: true,
                            content: data?.content,
                        },
                    })
                );
                setOpen(false);
            },
        });

    const { mutate: updateQuestionMutate, isLoading: updateQuestionLoading } =
        useMutation({
            mutationFn: async (
                questionBody: QuestionBodyItf<QuestionBodyContentItf>
            ) => await saveQuestion(testId!, questionBody, question!.id),
            mutationKey: [
                MUTATION_KEYS.UPDATE_QUESTION,
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

    return (
        <>
            <div
                className={`bg-orange-100 p-2 text-center cursor-pointer hover:bg-orange-200 ${
                    question && "border border-orange-500"
                }`}
                onClick={() => setOpen(true)}
            >
                Question {question?.order}
            </div>
            {open && (
                <Modal onClose={() => setOpen(false)}>
                    <ModalHeader title={`Question ${question?.order}`} />
                    <ModalBody>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="w-[600px]"
                        >
                            <div className="flex gap-4">
                                <div className="space-y-2 w-1/3 shrink-0">
                                    <div>
                                        <label htmlFor="score">Score: </label>
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

                                    <div>
                                        <label htmlFor="level">Level: </label>
                                        <Select
                                            className="grow capitalize"
                                            {...register("level")}
                                            options={Object.values(
                                                TEST_LEVEL
                                            ).map((level) => ({
                                                label: level,
                                                value: level,
                                            }))}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="type">Type: </label>
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
                                                label: type,
                                                value: type,
                                            }))}
                                        />
                                    </div>
                                </div>
                                <div className="border-l border-gray-300 border-dashed"></div>
                                <div className="grow overflow-hidden">
                                    {allValues?.content &&
                                        allValues?.type ===
                                            QUESTION_TYPE.MULTIPLE_CHOICES && (
                                            <MulitpleChoiceQuestion
                                                content={
                                                    allValues?.content as MultipleChoiceQuestionBodyItf
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
                                    {allValues?.content &&
                                        allValues?.type ===
                                            QUESTION_TYPE.FILL_IN_THE_GAPS && (
                                            <FillGapsQuestion
                                                content={
                                                    allValues?.content as FillGapsQuestionBodyItf
                                                }
                                                control={
                                                    control as Control<
                                                        QuestionBodyItf<FillGapsQuestionBodyItf>
                                                    >
                                                }
                                                errors={errors}
                                                register={
                                                    register as UseFormRegister<
                                                        QuestionBodyItf<FillGapsQuestionBodyItf>
                                                    >
                                                }
                                            />
                                        )}
                                    {allValues?.content &&
                                        allValues?.type ===
                                            QUESTION_TYPE.MATCHING && (
                                            <MatchingQuestion
                                                content={
                                                    allValues?.content as MatchingQuestionBodyItf
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
                                    {allValues?.content &&
                                        allValues?.type ===
                                            QUESTION_TYPE.RESPONSE && (
                                            <ResponseQuestion
                                                content={
                                                    allValues?.content as ResponseQuestionBodyItf
                                                }
                                                control={
                                                    control as Control<
                                                        QuestionBodyItf<ResponseQuestionBodyItf>
                                                    >
                                                }
                                                errors={errors}
                                                register={
                                                    register as UseFormRegister<
                                                        QuestionBodyItf<ResponseQuestionBodyItf>
                                                    >
                                                }
                                            />
                                        )}
                                </div>
                            </div>

                            <div className="flex justify-end mt-4 gap-2 border-t border-gray-300 pt-4">
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
