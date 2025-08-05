import {
    FillGapsQuestionItf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
    QuestionContentItf,
    QuestionItf,
    ResponseQuestionItf,
    TrueFalseQuestionItf,
} from "../../../types/types";
import MultipleChoicesQuestion from "./MultipleChoicesQuestion";
import FillGapsQuestion from "./FillGapsQuestion";
import MatchingQuestion from "./MatchingQuestion";
import ResponseQuestion from "./ResponseQuestion";
import { QUESTION_TYPE } from "../../../config/constants/tests";
import TrueFalseQuestion from "./TrueFalseQuestion";

type QuestionProps = {
    question: QuestionItf<QuestionContentItf>;
};

const Question = ({ question }: QuestionProps) => {
    return (
        <div className="px-4 py-2 border border-gray-300 border-dashed mt-1">
            <div className="underline">Question {question.order}: </div>
            {question.type === QUESTION_TYPE.MULTIPLE_CHOICES && (
                <MultipleChoicesQuestion
                    question={
                        question as QuestionItf<MultipleChoiceQuestionItf>
                    }
                />
            )}
            {question.type === QUESTION_TYPE.FILL_IN_THE_GAPS && (
                <FillGapsQuestion
                    question={question as QuestionItf<FillGapsQuestionItf>}
                />
            )}
            {question.type === QUESTION_TYPE.MATCHING && (
                <MatchingQuestion
                    question={question as QuestionItf<MatchingQuestionItf>}
                />
            )}
            {question.type === QUESTION_TYPE.RESPONSE && (
                <ResponseQuestion
                    question={question as QuestionItf<ResponseQuestionItf>}
                />
            )}
            {question.type === QUESTION_TYPE.TRUE_FALSE && (
                <TrueFalseQuestion
                    question={question as QuestionItf<TrueFalseQuestionItf>}
                />
            )}
        </div>
    );
};

export default Question;
