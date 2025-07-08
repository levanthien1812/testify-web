import React, { useCallback } from "react";
import {
    AnswerBodyContentItf,
    QuestionContentItf,
    QuestionItf,
    UserAnswerItf,
} from "../../../types/types";

type Props = {
    questions: QuestionItf<QuestionContentItf>[];
    answers: UserAnswerItf<AnswerBodyContentItf>[];
};

const QuestionsResultDemonstrator = ({ questions, answers }: Props) => {
    const getCorrectStatus = useCallback(
        (question: QuestionItf<QuestionContentItf>) => {
            const userAnswer = answers.find(
                (answer) => answer.question_id === question.id
            );
            return userAnswer?.is_correct;
        },
        [answers]
    );

    return (
        <div className="grid grid-cols-10 gap-1 px-2 py-1">
            {questions.map((question) => (
                <div
                    className={`w-4 h-4 ${
                        getCorrectStatus(question)
                            ? "bg-green-400"
                            : "bg-red-400"
                    } rounded-full`}
                    key={question.id}
                ></div>
            ))}
        </div>
    );
};

export default QuestionsResultDemonstrator;
