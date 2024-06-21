import { questionTypes } from "../config/config";
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
    [questionTypes.MULITPLE_CHOICES, mulitpleChoicesQuestionSchema],
    [questionTypes.FILL_GAPS, fillGapsQuestionSchema],
    [questionTypes.MATCHING, matchingQuestionSchema],
    [questionTypes.RESPONSE, responseQuestionSchema],
]);

export const questionTypeToQuestionComponent = {
    [questionTypes.MULITPLE_CHOICES]: MulitpleChoiceQuestion,
    [questionTypes.FILL_GAPS]: FillGapsQuestion,
    [questionTypes.MATCHING]: MatchingQuestion,
    [questionTypes.RESPONSE]: ResponseQuestion,
};
