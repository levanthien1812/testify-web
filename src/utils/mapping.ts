import {
    INITIAL_FILL_GAPS_QUESTION,
    INITIAL_MATCHING_QUESTION,
    INITIAL_MULTIPLE_CHOICES_QUESTION,
    INITIAL_RESPONSE_QUESTION,
} from "../config/constants/initialValues";
import { QUESTION_TYPE } from "../config/constants/tests";
import FillGapsQuestion from "../pages/createTestPage.tsx/components/testQuestions/FillGapsQuestion";
import MatchingQuestion from "../pages/createTestPage.tsx/components/testQuestions/MatchingQuestion";
import MulitpleChoiceQuestion from "../pages/createTestPage.tsx/components/testQuestions/MultipleChoicesQuestion";
import ResponseQuestion from "../pages/createTestPage.tsx/components/testQuestions/ResponseQuestion";
import {
    FillGapsQuestionItf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
    QuestionBodyContentItf,
    ResponseQuestionItf,
} from "../types/types";
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

export const getInitialQuestionContent = (
    type: (typeof QUESTION_TYPE)[keyof typeof QUESTION_TYPE]
):
    | MultipleChoiceQuestionItf
    | FillGapsQuestionItf
    | MatchingQuestionItf
    | ResponseQuestionItf => {
    switch (type) {
        case QUESTION_TYPE.MULTIPLE_CHOICES:
            return INITIAL_MULTIPLE_CHOICES_QUESTION;

        case QUESTION_TYPE.FILL_IN_THE_GAPS:
            return INITIAL_FILL_GAPS_QUESTION;

        case QUESTION_TYPE.MATCHING:
            return INITIAL_MATCHING_QUESTION;

        case QUESTION_TYPE.RESPONSE:
            return INITIAL_RESPONSE_QUESTION;
        default:
            return INITIAL_MULTIPLE_CHOICES_QUESTION;
    }
};
