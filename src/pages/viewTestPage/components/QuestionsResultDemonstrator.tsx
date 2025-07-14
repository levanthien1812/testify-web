import React, { useCallback } from "react";
import {
    AnswerContentItf,
    QuestionContentItf,
    QuestionItf,
    UserAnswerItf,
} from "../../../types/types";

type Props = {
    questions: QuestionItf<QuestionContentItf>[];
    answers: UserAnswerItf<AnswerContentItf>[];
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
                <button
                    className={`w-4 h-4 ${
                        getCorrectStatus(question)
                            ? "bg-green-400 hover:bg-green-500"
                            : "bg-red-400 hover:bg-red-500"
                    } rounded-full`}
                    key={question.id}
                ></button>
            ))}
        </div>
    );
};

export default QuestionsResultDemonstrator;
