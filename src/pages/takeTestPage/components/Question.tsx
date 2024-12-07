import React from "react";
import {
    FillGapsQuestionItf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
    QuestionItf,
    ResponseQuestionItf,
    UserAnswer,
} from "../../../types/types";
import MultipleChoicesQuestion from "./MultipleChoicesQuestion";
import FillGapsQuestion from "./FillGapsQuestion";
import MatchingQuestion from "./MatchingQuestion";
import ResponseQuestion from "./ResponseQuestion";
import { QUESTION_TYPE } from "../../../config/constants/tests";

type QuestionProps = {
    question: QuestionItf;
    onProvideAnswer: (answer: UserAnswer) => void;
};

const Question = ({ question, onProvideAnswer }: QuestionProps) => {
    return (
        <div className="px-4 py-2" key={question.id}>
            <div>Question {question.order}: </div>
            {question.type === QUESTION_TYPE.MULTIPLE_CHOICES && (
                <MultipleChoicesQuestion
                    content={question.content as MultipleChoiceQuestionItf}
                    onProvideAnswer={(answer) =>
                        onProvideAnswer({
                            question_id: question.id!,
                            answer: answer,
                        })
                    }
                />
            )}
            {question.type === QUESTION_TYPE.FILL_IN_THE_GAPS && (
                <FillGapsQuestion
                    content={question.content as FillGapsQuestionItf}
                    onProvideAnswer={(answer) =>
                        onProvideAnswer({
                            question_id: question.id!,
                            answer: answer,
                        })
                    }
                />
            )}
            {question.type === QUESTION_TYPE.MATCHING && (
                <MatchingQuestion
                    content={question.content as MatchingQuestionItf}
                    onProvideAnswer={(answer) =>
                        onProvideAnswer({
                            question_id: question.id!,
                            answer: answer,
                        })
                    }
                />
            )}
            {question.type === QUESTION_TYPE.RESPONSE && (
                <ResponseQuestion
                    content={question.content as ResponseQuestionItf}
                    onProvideAnswer={(answer) =>
                        onProvideAnswer({
                            question_id: question.id!,
                            answer: answer,
                        })
                    }
                />
            )}
        </div>
    );
};

export default Question;
