import React from "react";
import {
    FillGapsQuestionFormDataItf,
    FillGapsQuestionItf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
    QuestionItf,
} from "../../../../types/types";
import Question from "../testQuestions/Question";
import { questionTypes } from "../../../../config/config";
import MultipleChoicesAnswer from "./MultipleChoicesAnswer";
import FillGapsAnswer from "./FillGapsAnswer";
import MatchingAnswer from "./MatchingAnswer";

const Answer: React.FC<{
    question: QuestionItf;
    onAfterUpdate: () => void;
}> = ({ question, onAfterUpdate }) => {
    return (
        <div>
            <p className="px-2 text-white bg-orange-600 w-fit">
                Question {question.order}:
            </p>
            <div>
                {question.type === questionTypes.MULITPLE_CHOICES && (
                    <MultipleChoicesAnswer
                        content={question.content as MultipleChoiceQuestionItf}
                    />
                )}
                {question.type === questionTypes.FILL_GAPS && (
                    <FillGapsAnswer
                        content={question.content as FillGapsQuestionItf}
                    />
                )}
                {question.type === questionTypes.MATCHING && (
                    <MatchingAnswer
                        content={question.content as MatchingQuestionItf}
                    />
                )}
            </div>
        </div>
    );
};

export default Answer;
