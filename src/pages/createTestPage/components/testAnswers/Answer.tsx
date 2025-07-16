import React, { useEffect, useState } from "react";
import {
    AnswerContentItf,
    FillGapsQuestionItf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
    QuestionContentItf,
    QuestionItf,
    ResponseQuestionItf,
    TrueFalseQuestionItf,
} from "../../../../types/types";
import MultipleChoicesAnswer from "./MultipleChoicesAnswer";
import FillGapsAnswer from "./FillGapsAnswer";
import MatchingAnswer from "./MatchingAnswer";
import { useMutation } from "react-query";
import { addAnswer } from "../../../../services/test";
import ResponseAnswer from "./ResponseAnswer";
import Button from "../../../../components/elements/Button";
import { QUESTION_TYPE } from "../../../../config/constants/tests";
import { createTestActions } from "../../../../stores/createTest";
import { useDispatch } from "react-redux";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import { toast } from "react-toastify";
import { TOAST_MESSAGES } from "../../../../config/constants/toasts";
import TrueFalseAnswer from "./TrueFalseAnswer";
import TextEditor from "../../../../components/richTextEditor/TiptapEditor";
import HtmlDisplay from "../../../../components/elements/HtmlDisplay";
import { getRound } from "../../../../utils/primitives";

const Answer: React.FC<{
    question: QuestionItf<QuestionContentItf>;
}> = ({ question }) => {
    const [savable, setSavable] = useState<boolean>(false);
    const [reset, setReset] = useState<boolean>(false);
    const { saveTestQuestions } = createTestActions;
    const [isAddingExplaination, setIsAddingExplaination] =
        useState<boolean>(false);
    const dispatch = useDispatch();

    const { mutate, isLoading } = useMutation({
        mutationFn: async (answerBody: AnswerContentItf) =>
            await addAnswer(question.test_id, question.id!, answerBody),
        mutationKey: [MUTATION_KEYS.ADD_ANSWER, { question_id: question.id }],
        onSuccess: (data) => {
            setSavable(false);
            toast.success(TOAST_MESSAGES.ADD_ANSWER_SUCCESSFULLY);
            const updatedContent = {
                ...question.content,
                answer: {
                    ...question.content?.answer,
                    is_saved: true,
                },
            };
            dispatch(
                saveTestQuestions({
                    partId: question?.part_id,
                    questionOrder: question.order,
                    questionInfo: {
                        content: updatedContent as QuestionContentItf,
                    },
                })
            );
            setIsAddingExplaination(false);
        },
    });

    const handleProvideAnswer = (answerBody: AnswerContentItf) => {
        setReset(false);
        const updatedContent = {
            ...question.content,
            answer: answerBody,
        };
        dispatch(
            saveTestQuestions({
                partId: question?.part_id,
                questionOrder: question.order,
                questionInfo: {
                    content: updatedContent as QuestionContentItf,
                },
            })
        );
        setSavable(true);
    };

    const handleSaveAnswer = () => {
        if (question?.content?.answer) mutate(question.content.answer);
    };

    const handleExplainationChange = (value: string) => {
        if (value.length > 0) {
            setSavable(true);
        }
        dispatch(
            saveTestQuestions({
                partId: question?.part_id,
                questionOrder: question.order,
                questionInfo: {
                    content: {
                        ...question.content,
                        answer: {
                            ...question.content?.answer,
                            explaination: value,
                        },
                    } as QuestionContentItf,
                },
            })
        );
    };

    return (
        <div>
            <div className="flex justify-start items-center">
                <p
                    className={`px-2 text-white ${
                        question.content?.answer?.is_saved
                            ? "bg-orange-600"
                            : "bg-gray-600"
                    } w-fit`}
                >
                    Question {question.order}{" "}
                    <span className="italic">
                        ({getRound(question.score)} points)
                    </span>{" "}
                    :
                </p>
                {question?.content?.answer?.is_saved && (
                    <p className="text-orange-600 italic ms-1">Saved</p>
                )}
            </div>

            <div className={`px-2 py-2 bg-orange-50 border border-gray-400`}>
                {question.type === QUESTION_TYPE.MULTIPLE_CHOICES && (
                    <MultipleChoicesAnswer
                        reset={reset}
                        content={question.content as MultipleChoiceQuestionItf}
                        onProvideAnswer={handleProvideAnswer}
                    />
                )}
                {question.type === QUESTION_TYPE.FILL_IN_THE_GAPS && (
                    <FillGapsAnswer
                        reset={reset}
                        content={question.content as FillGapsQuestionItf}
                        onProvideAnswer={handleProvideAnswer}
                    />
                )}
                {question.type === QUESTION_TYPE.MATCHING && (
                    <MatchingAnswer
                        reset={reset}
                        content={question.content as MatchingQuestionItf}
                        onProvideAnswer={handleProvideAnswer}
                    />
                )}
                {question.type === QUESTION_TYPE.RESPONSE && (
                    <ResponseAnswer
                        content={question.content as ResponseQuestionItf}
                    />
                )}
                {question.type === QUESTION_TYPE.TRUE_FALSE && (
                    <TrueFalseAnswer
                        reset={reset}
                        content={question.content as TrueFalseQuestionItf}
                        onProvideAnswer={handleProvideAnswer}
                    />
                )}
            </div>

            {isAddingExplaination && (
                <div className="mt-2">
                    <div className="flex gap-2 mb-1 items-center">
                        <p className="">Explaination:</p>
                        <Button
                            outlined
                            onClick={() => setIsAddingExplaination(false)}
                            size="sm"
                            className="ms-auto"
                        >
                            Close
                        </Button>
                    </div>
                    <TextEditor
                        content={question.content!.answer?.explaination || ""}
                        setContent={handleExplainationChange}
                    />
                </div>
            )}

            {!question.content?.answer?.explaination &&
                !isAddingExplaination && (
                    <div className="mt-1">
                        <Button
                            outlined
                            size="sm"
                            onClick={() => setIsAddingExplaination(true)}
                        >
                            Add explaination
                        </Button>
                    </div>
                )}

            {question.content?.answer?.explaination &&
                !isAddingExplaination && (
                    <div className="mt-2">
                        <div className="flex gap-2 mb-1 items-center">
                            <p className="">Explaination:</p>
                            {!isAddingExplaination && (
                                <Button
                                    outlined
                                    size="sm"
                                    onClick={() =>
                                        setIsAddingExplaination(true)
                                    }
                                >
                                    Edit
                                </Button>
                            )}
                        </div>
                        <HtmlDisplay
                            htmlContent={question.content.answer.explaination}
                            className="bg-orange-50 border border-gray-400 p-2"
                        />
                    </div>
                )}

            {savable && (
                <div className="flex mt-2 gap-2 justify-end items-center">
                    <Button
                        secondary
                        onClick={() => {
                            setReset(true);
                            setSavable(false);
                        }}
                        size="sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveAnswer}
                        disabled={isLoading}
                        type="submit"
                        size="sm"
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Answer;
