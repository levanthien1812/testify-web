import React, { useState } from "react";
import {
    AnswerBody,
    FillGapsQuestionItf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
    MultipleChoicesAnswerBodyItf,
    QuestionItf,
    ResponseQuestionItf,
} from "../../../../types/types";
import MultipleChoicesAnswer from "./MultipleChoicesAnswer";
import FillGapsAnswer from "./FillGapsAnswer";
import MatchingAnswer from "./MatchingAnswer";
import { useMutation } from "react-query";
import { addAnswer } from "../../../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import ResponseAnswer from "./ResponseAnswer";
import Button from "../../../../components/elements/Button";
import { useForm } from "react-hook-form";
import { QUESTION_TYPE } from "../../../../config/constants/tests";

const Answer: React.FC<{
    question: QuestionItf;
}> = ({ question }) => {
    const [savable, setSavable] = useState<boolean>(false);
    const [reset, setReset] = useState<boolean>(false);
    const [answerBody, setAnswerBody] = useState<AnswerBody>();

    const { mutate, isLoading } = useMutation({
        mutationFn: async (answerBody: AnswerBody) =>
            await addAnswer(question.test_id, question.id!, answerBody),
        mutationKey: ["add-answer", { question_id: question.id }],
        onSuccess: (data) => {
            setSavable(false);
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
                    question.content!.answer &&
                    question.content!.answer.length > 0
                        ? "bg-gray-600"
                        : "bg-orange-600"
                } w-fit`}
            >
                Question {question.order}{" "}
                <span className="italic">({question.score} points)</span> :
            </p>
            <div
                className={`px-2 py-2 border ${
                    question.content!.answer &&
                    question.content!.answer.length > 0
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
