import {
    FillGapsQuestionItf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
    QuestionContentItf,
    QuestionItf,
    ResponseQuestionItf,
} from "../../../types/types";
import MultipleChoicesQuestion from "./MultipleChoicesQuestion";
import FillGapsQuestion from "./FillGapsQuestion";
import MatchingQuestion from "./MatchingQuestion";
import ResponseQuestion from "./ResponseQuestion";
import { QUESTION_TYPE } from "../../../config/constants/tests";

type QuestionProps = {
    question: QuestionItf<QuestionContentItf>;
};

const Question = ({ question }: QuestionProps) => {
    return (
        <div className="px-4 py-2 hover:border hover:border-gray-300 hover:border-dashed mt-1">
            <div>Question {question.order}: </div>
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
        </div>
    );
};

export default Question;
