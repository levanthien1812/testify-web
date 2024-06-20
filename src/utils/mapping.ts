import { questionTypes } from "../config/config";
import {
    fillGapsQuestionSchema,
    matchingQuestionSchema,
    mulitpleChoicesQuestionSchema,
} from "../validations/test";

export const questionTypeToQuestionSchema = new Map([
    [questionTypes.MULITPLE_CHOICES, mulitpleChoicesQuestionSchema],
    [questionTypes.FILL_GAPS, fillGapsQuestionSchema],
    [questionTypes.MATCHING, matchingQuestionSchema],
]);
