import React from "react";
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
import { questionTypes } from "../../../config/config";
import MultipleChoicesAnswer from "./MultipleChoicesAnswer";
import FillGapsAnswer from "./FillGapsAnswer";
import MatchingAnswer from "./MatchingAnswer";
import ResponseAnswer from "./ResponseAnswer";

type QuestionProps = {
    question: QuestionItf;
};

const Answer = ({ question }: QuestionProps) => {
    return (
        <div className="px-4 py-2" key={question._id}>
            <div>
                <span className="underline">Question {question.order}:</span>{" "}
                {question.content.answer && (
                    <span className="font-bold italic">
                        (
                        {question.answer
                            ? question.answer.score
                            : question.score}{" "}
                        points)
                    </span>
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
        </div>
    );
};

export default Answer;
