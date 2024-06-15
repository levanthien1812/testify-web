import React from "react";
import {
    FillGapsAnswerItf,
    FillGapsQuestionItf,
    MatchingAnswerItf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
    MultipleChoicesAnswerItf,
    QuestionItf,
} from "../../../types/types";
import { questionTypes } from "../../../config/config";
import MultipleChoicesAnswer from "./MultipleChoicesAnswer";
import FillGapsAnswer from "./FillGapsAnswer";
import MatchingAnswer from "./MatchingAnswer";

type QuestionProps = {
    question: QuestionItf;
};

const Answer = ({ question }: QuestionProps) => {
    return (
        <div className="px-4 py-2" key={question._id}>
            <div>Question {question.order}: </div>
            {question.type === questionTypes.MULITPLE_CHOICES && (
                <MultipleChoicesAnswer
                    content={question.content as MultipleChoiceQuestionItf}
                    userAnswer={
                        question.answer!.content as MultipleChoicesAnswerItf
                    }
                />
            )}
            {question.type === questionTypes.FILL_GAPS && (
                <FillGapsAnswer
                    content={question.content as FillGapsQuestionItf}
                    userAnswer={question.answer!.content as FillGapsAnswerItf}
                />
            )}
            {question.type === questionTypes.MATCHING && (
                <MatchingAnswer
                    content={question.content as MatchingQuestionItf}
                    userAnswer={question.answer!.content as MatchingAnswerItf}
                />
            )}
        </div>
    );
};

export default Answer;
