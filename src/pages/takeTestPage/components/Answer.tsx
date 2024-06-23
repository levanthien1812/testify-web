import { useMemo, useState } from "react";
import {
    FillGapsAnswerItf,
    FillGapsQuestionItf,
    MatchingAnswerItf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
    MultipleChoicesAnswerItf,
    QuestionItf,
    ResponseAnswerItf,
    ResponseQuestionItf,
} from "../../../types/types";
import { manualScoreTypes, questionTypes } from "../../../config/config";
import MultipleChoicesAnswer from "./MultipleChoicesAnswer";
import FillGapsAnswer from "./FillGapsAnswer";
import MatchingAnswer from "./MatchingAnswer";
import ResponseAnswer from "./ResponseAnswer";

type QuestionProps = {
    question: QuestionItf;
};

const Answer = ({ question }: QuestionProps) => {
    const [manualScore, setManualScore] = useState<number | null>(null);

    const needManualScore = useMemo(() => {
        return (
            manualScoreTypes.includes(question.type) &&
            (!question.answer || !question.answer.score)
        );
    }, [question.type]);

    return (
        <div
            className={`px-4 py-2 ${
                needManualScore ? "bg-orange-100" : "bg-white"
            }`}
        >
            <div>
                <span className="underline">Question {question.order}:</span>{" "}
                {question.content.answer && (
                    <>
                        <span className="font-bold italic">
                            (
                            {question.answer
                                ? question.answer.score
                                : question.score}{" "}
                            points)
                        </span>{" "}
                        {question.answer !== undefined && (
                            <span className="font-bold italic">
                                {question.answer !== null ? (
                                    question.answer.score! > 0 ? (
                                        <span className="text-green-600">
                                            Correct ✅
                                        </span>
                                    ) : (
                                        <span className="text-red-600">
                                            Wrong ❌
                                        </span>
                                    )
                                ) : (
                                    "No answer"
                                )}
                            </span>
                        )}
                    </>
                )}
            </div>
            {question.type === questionTypes.MULITPLE_CHOICES && (
                <MultipleChoicesAnswer
                    content={question.content as MultipleChoiceQuestionItf}
                    userAnswer={
                        question.answer
                            ? (question.answer
                                  .content as MultipleChoicesAnswerItf)
                            : null
                    }
                />
            )}
            {question.type === questionTypes.FILL_GAPS && (
                <FillGapsAnswer
                    content={question.content as FillGapsQuestionItf}
                    userAnswer={
                        question.answer
                            ? (question.answer.content as FillGapsAnswerItf)
                            : null
                    }
                />
            )}
            {question.type === questionTypes.MATCHING && (
                <MatchingAnswer
                    content={question.content as MatchingQuestionItf}
                    userAnswer={
                        question.answer
                            ? (question.answer.content as MatchingAnswerItf)
                            : null
                    }
                />
            )}
            {question.type === questionTypes.RESPONSE && (
                <ResponseAnswer
                    content={question.content as ResponseQuestionItf}
                    userAnswer={
                        question.answer
                            ? (question.answer.content as ResponseAnswerItf)
                            : null
                    }
                />
            )}

            {needManualScore && (
                <div className="border-t pt-2 border-gray-400 border-dashed">
                    <label htmlFor="manualScore">Score: </label>
                    <input
                        type="number"
                        name="manualScore"
                        id="manualScore"
                        className="border border-gray-500 px-2 py-1 grow focus:border-orange-600 outline-none leading-5 ms-2"
                    />

                    <button className="bg-orange-600 text-white px-4 py-0.5 ms-2 hover:bg-orange-700">
                        Save
                    </button>
                </div>
            )}
        </div>
    );
};

export default Answer;
