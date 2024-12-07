import { QUESTION_TYPE } from "../config/constants/tests";
import FillGapsQuestion from "../pages/createTestPage.tsx/components/testQuestions/FillGapsQuestion";
import MatchingQuestion from "../pages/createTestPage.tsx/components/testQuestions/MatchingQuestion";
import MulitpleChoiceQuestion from "../pages/createTestPage.tsx/components/testQuestions/MultipleChoicesQuestion";
import ResponseQuestion from "../pages/createTestPage.tsx/components/testQuestions/ResponseQuestion";
import {
    fillGapsQuestionSchema,
    matchingQuestionSchema,
    mulitpleChoicesQuestionSchema,
    responseQuestionSchema,
} from "../validations/test";

export const questionTypeToQuestionSchema = new Map([
    [QUESTION_TYPE.MULTIPLE_CHOICES, mulitpleChoicesQuestionSchema],
    [QUESTION_TYPE.FILL_IN_THE_GAPS, fillGapsQuestionSchema],
    [QUESTION_TYPE.MATCHING, matchingQuestionSchema],
    [QUESTION_TYPE.RESPONSE, responseQuestionSchema],
]);

export const questionTypeToQuestionComponent = {
    [QUESTION_TYPE.MULTIPLE_CHOICES]: MulitpleChoiceQuestion,
    [QUESTION_TYPE.FILL_IN_THE_GAPS]: FillGapsQuestion,
    [QUESTION_TYPE.MATCHING]: MatchingQuestion,
    [QUESTION_TYPE.RESPONSE]: ResponseQuestion,
};
