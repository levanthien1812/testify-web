import React, { useCallback } from "react";
import {
    AnswerContentItf,
    QuestionContentItf,
    QuestionItf,
    UserAnswerItf,
} from "../../../types/types";
import { useAppSelector } from "../../../hooks/hooks";
import { getRound } from "../../../utils/primitives";
import { MANUAL_SCORE_TYPES } from "../../../config/constants/tests";

type Props = {
    questions: QuestionItf<QuestionContentItf>[];
    answers: UserAnswerItf<AnswerContentItf>[];
};

const Item = ({ questions, answers }: Props) => {
    const getCorrectStatus = useCallback(
        (question: QuestionItf<QuestionContentItf>) => {
            const userAnswer = answers.find(
                (answer) => answer.question_id === question.id
            );
            if (
                userAnswer &&
                userAnswer.score &&
                userAnswer.score > 0 &&
                (userAnswer.score < question.score ||
                    MANUAL_SCORE_TYPES.includes(question.type))
            )
                return "partial";
            if (userAnswer?.is_correct) return "correct";
            return "incorrect";
        },
        [answers]
    );

    return (
        <div className="bg-gray-100 w-full flex justify-center">
            <div className="grid grid-cols-10 gap-1 px-2 py-1">
                {questions.map((question) => (
                    <button
                        className={`w-4 h-4 ${
                            getCorrectStatus(question) === "correct"
                                ? "bg-green-400 hover:bg-green-500"
                                : getCorrectStatus(question) === "partial"
                                ? "bg-yellow-400 hover:bg-yellow-500"
                                : "bg-red-400 hover:bg-red-500"
                        } rounded-full`}
                        key={question.id}
                    ></button>
                ))}
            </div>
        </div>
    );
};

const QuestionsResultDemonstrator = ({ answers }: Pick<Props, "answers">) => {
    const test = useAppSelector((state) => state.viewTest.test);

    const calculateTotalPartScore = (partId: string) => {
        const part = test?.parts.find((part) => part.id === partId);
        const totalScore = part?.questions?.reduce((total, question) => {
            const questionResult = answers.find(
                (answer) => answer.question_id === question.id
            );
            return total + (questionResult?.score || 0);
        }, 0);
        return totalScore;
    };

    return (
        <div className="border border-dashed border-gray-400 mt-4 p-2">
            <p className="text-xl text-center mb-2">
                Questions result demonstration
            </p>
            <div className="w-full md:w-[50%] mx-auto">
                {test && test.questions && (
                    <div className="flex justify-center border border-dashed border-gray-400">
                        <Item questions={test.questions} answers={answers} />
                    </div>
                )}

                {test && test.parts.every((part) => part.questions) && (
                    <div className="space-y-1">
                        {test.parts.map((part) => (
                            <div className="flex flex-col items-center justify-center">
                                <p className="w-full bg-gray-300 text-black px-2 py-0 text-center">
                                    Part {part.order} -{" "}
                                    <span className="font-bold">
                                        {getRound(
                                            calculateTotalPartScore(part.id!) ||
                                                0
                                        )}
                                    </span>{" "}
                                    pts
                                </p>
                                <Item
                                    questions={part.questions!}
                                    answers={answers}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionsResultDemonstrator;
