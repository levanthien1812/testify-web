import React, { useState } from "react";
import {
    AnswerFormData,
    FillGapsAnswerFormDataInf,
    FillGapsQuestionFormDataItf,
    FillGapsQuestionItf,
    MatchingAnswerFormDataInf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
    MultipleChoicesAnswerFormDataInf,
    QuestionItf,
} from "../../../../types/types";
import Question from "../testQuestions/Question";
import { questionTypes } from "../../../../config/config";
import MultipleChoicesAnswer from "./MultipleChoicesAnswer";
import FillGapsAnswer from "./FillGapsAnswer";
import MatchingAnswer from "./MatchingAnswer";
import { useMutation } from "react-query";
import { addAnswer } from "../../../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const Answer: React.FC<{
    question: QuestionItf;
    onAfterUpdate: () => void;
}> = ({ question, onAfterUpdate }) => {
    const [savable, setSavable] = useState<boolean>(false);
    const [answerBody, setAnswerBody] = useState<AnswerFormData>();

    const { mutate, isLoading } = useMutation({
        mutationFn: async (answerBody: AnswerFormData) =>
            await addAnswer(question.test_id, question._id, answerBody),
        mutationKey: ["add-answer", { question_id: question._id }],
        onSuccess: (data) => {
            setSavable(false)
            onAfterUpdate();
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        },
    });

    const handleProvideAnswer = (answerBody: AnswerFormData) => {
        setAnswerBody(answerBody);
        setSavable(true);
    };

    const handleSaveAnswer = () => {
        if (answerBody) mutate(answerBody);
    };

    return (
        <div>
            <p className="px-2 text-white bg-orange-600 w-fit">
                Question {question.order}{" "}
                <span className="italic">({question.score} points)</span> :
            </p>
            <div>
                {question.type === questionTypes.MULITPLE_CHOICES && (
                    <MultipleChoicesAnswer
                        content={question.content as MultipleChoiceQuestionItf}
                        onProvideAnswer={handleProvideAnswer}
                    />
                )}
                {question.type === questionTypes.FILL_GAPS && (
                    <FillGapsAnswer
                        content={question.content as FillGapsQuestionItf}
                        onProvideAnswer={handleProvideAnswer}
                    />
                )}
                {question.type === questionTypes.MATCHING && (
                    <MatchingAnswer
                        content={question.content as MatchingQuestionItf}
                        onProvideAnswer={handleProvideAnswer}
                    />
                )}
            </div>

            {savable && (
                <div className="flex justify-end">
                    <button className="px-4 py-0.5 bg-gray-600 text-white w-1/5 hover:bg-gray-500">
                        Cancel
                    </button>
                    <button
                        className="px-4 py-0.5 bg-orange-600 text-white w-1/5 hover:bg-orange-500 "
                        onClick={handleSaveAnswer}
                    >
                        Save
                    </button>
                </div>
            )}
        </div>
    );
};

export default Answer;
