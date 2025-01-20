import React, { useState } from "react";
import {
    AnswerBodyContentItf,
    FillGapsQuestionItf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
    QuestionContentItf,
    QuestionItf,
    ResponseQuestionItf,
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

const Answer: React.FC<{
    question: QuestionItf<QuestionContentItf>;
}> = ({ question }) => {
    const [savable, setSavable] = useState<boolean>(false);
    const [reset, setReset] = useState<boolean>(false);
    const { saveTestQuestions } = createTestActions;
    const dispatch = useDispatch();

    const { mutate, isLoading } = useMutation({
        mutationFn: async (answerBody: AnswerBodyContentItf) =>
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
        },
    });

    const handleProvideAnswer = (answerBody: AnswerBodyContentItf) => {
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

    return (
        <div>
            <div className="flex justify-start">
                <p
                    className={`px-2 text-white ${
                        !question.content?.answer?.is_saved
                            ? "bg-gray-600"
                            : "bg-orange-600"
                    } w-fit`}
                >
                    Question {question.order}{" "}
                    <span className="italic">({question.score} points)</span> :
                </p>
                {question?.content?.answer?.is_saved && (
                    <p className="text-orange-600 italic ms-1">Saved</p>
                )}
            </div>

            <div
                className={`px-2 py-2 border ${
                    question.content!.answer
                        ? "border-gray-600"
                        : "border-orange-600"
                }`}
            >
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
            </div>

            {savable && (
                <div className="flex justify-end">
                    <Button
                        primary={false}
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
