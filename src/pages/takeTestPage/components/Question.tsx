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
import { questionTypes } from "../../../config/config";
import ResponseQuestion from "./ResponseQuestion";

type QuestionProps = {
    question: QuestionItf;
    onProvideAnswer: (answer: UserAnswer) => void;
};

const Question = ({ question, onProvideAnswer }: QuestionProps) => {
    return (
        <div className="px-4 py-2" key={question._id}>
            <div>Question {question.order}: </div>
            {question.type === questionTypes.MULITPLE_CHOICES && (
                <MultipleChoicesQuestion
                    content={question.content as MultipleChoiceQuestionItf}
                    onProvideAnswer={(answer) =>
                        onProvideAnswer({
                            question_id: question._id,
                            answer: answer,
                        })
                    }
                />
            )}
            {question.type === questionTypes.FILL_GAPS && (
                <FillGapsQuestion
                    content={question.content as FillGapsQuestionItf}
                    onProvideAnswer={(answer) =>
                        onProvideAnswer({
                            question_id: question._id,
                            answer: answer,
                        })
                    }
                />
            )}
            {question.type === questionTypes.MATCHING && (
                <MatchingQuestion
                    content={question.content as MatchingQuestionItf}
                    onProvideAnswer={(answer) =>
                        onProvideAnswer({
                            question_id: question._id,
                            answer: answer,
                        })
                    }
                />
            )}
            {question.type === questionTypes.RESPONSE && (
                <ResponseQuestion
                    content={question.content as ResponseQuestionItf}
                    onProvideAnswer={(answer) =>
                        onProvideAnswer({
                            question_id: question._id,
                            answer: answer,
                        })
                    }
                />
            )}
        </div>
    );
};

export default Question;
