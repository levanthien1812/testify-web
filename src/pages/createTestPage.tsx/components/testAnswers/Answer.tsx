import React, { useState } from "react";
import {
    AnswerBody,
    FillGapsQuestionItf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
    QuestionItf,
    ResponseQuestionItf,
} from "../../../../types/types";
import { questionTypes } from "../../../../config/config";
import MultipleChoicesAnswer from "./MultipleChoicesAnswer";
import FillGapsAnswer from "./FillGapsAnswer";
import MatchingAnswer from "./MatchingAnswer";
import { useMutation } from "react-query";
import { addAnswer } from "../../../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import ResponseAnswer from "./ResponseAnswer";
import Button from "../../../../components/elements/Button";

const Answer: React.FC<{
    question: QuestionItf;
    onAfterUpdate: () => void;
}> = ({ question, onAfterUpdate }) => {
    const [savable, setSavable] = useState<boolean>(false);
    const [reset, setReset] = useState<boolean>(false);
    const [answerBody, setAnswerBody] = useState<AnswerBody>();

    const { mutate, isLoading } = useMutation({
        mutationFn: async (answerBody: AnswerBody) =>
            await addAnswer(question.test_id, question._id, answerBody),
        mutationKey: ["add-answer", { question_id: question._id }],
        onSuccess: (data) => {
            setSavable(false);
            onAfterUpdate();
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        },
    });

    const handleProvideAnswer = (answerBody: AnswerBody) => {
        setReset(false);
        setAnswerBody(answerBody);
        setSavable(true);
    };

    const handleSaveAnswer = () => {
        if (answerBody) mutate(answerBody);
    };

    return (
        <div>
            <p
                className={`px-2 text-white ${
                    question.content.answer &&
                    question.content.answer.length > 0
                        ? "bg-gray-600"
                        : "bg-orange-600"
                } w-fit`}
            >
                Question {question.order}{" "}
                <span className="italic">({question.score} points)</span> :
            </p>
            <div
                className={`px-2 py-2 border ${
                    question.content.answer &&
                    question.content.answer.length > 0
                        ? "border-gray-600"
                        : "border-orange-600"
                }`}
            >
                {question.type === questionTypes.MULITPLE_CHOICES && (
                    <MultipleChoicesAnswer
                        reset={reset}
                        content={question.content as MultipleChoiceQuestionItf}
                        onProvideAnswer={handleProvideAnswer}
                    />
                )}
                {question.type === questionTypes.FILL_GAPS && (
                    <FillGapsAnswer
                        reset={reset}
                        content={question.content as FillGapsQuestionItf}
                        onProvideAnswer={handleProvideAnswer}
                    />
                )}
                {question.type === questionTypes.MATCHING && (
                    <MatchingAnswer
                        reset={reset}
                        content={question.content as MatchingQuestionItf}
                        onProvideAnswer={handleProvideAnswer}
                    />
                )}
                {question.type === questionTypes.RESPONSE && (
                    <ResponseAnswer
                        content={question.content as ResponseQuestionItf}
                    />
                )}
            </div>

            {savable && (
                <div className="flex justify-end">
                    <Button
                        className="w-1/5"
                        primary={false}
                        onClick={() => {
                            setReset(true);
                            setSavable(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="w-1/5"
                        onClick={handleSaveAnswer}
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Answer;
