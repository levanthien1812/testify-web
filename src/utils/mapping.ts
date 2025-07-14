import {
    faCheck,
    faFill,
    faList,
    faPen,
    faUpDownLeftRight,
} from "@fortawesome/free-solid-svg-icons";
import {
    INITIAL_FILL_GAPS_ANSWER,
    INITIAL_FILL_GAPS_QUESTION,
    INITIAL_MATCHING_ANSWER,
    INITIAL_MATCHING_QUESTION,
    INITIAL_MULTIPLE_CHOICES_ANSWER,
    INITIAL_MULTIPLE_CHOICES_QUESTION,
    INITIAL_RESPONSE_ANSWER,
    INITIAL_RESPONSE_QUESTION,
    INITIAL_TRUE_FALSE_ANSWER,
} from "../config/constants/initialValues";
import { QUESTION_TYPE } from "../config/constants/tests";
import FillGapsQuestion from "../pages/createTestPage/components/testQuestions/FillGapsQuestion";
import MatchingQuestion from "../pages/createTestPage/components/testQuestions/MatchingQuestion";
import MulitpleChoiceQuestion from "../pages/createTestPage/components/testQuestions/MultipleChoicesQuestion";
import ResponseQuestion from "../pages/createTestPage/components/testQuestions/ResponseQuestion";
import {
    AnswerContentItf,
    FillGapsQuestionItf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
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
    type: QUESTION_TYPE
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

export const getInitialAnswerContent = (
    type: QUESTION_TYPE
): AnswerContentItf => {
    switch (type) {
        case QUESTION_TYPE.MULTIPLE_CHOICES:
            return INITIAL_MULTIPLE_CHOICES_ANSWER;
        case QUESTION_TYPE.FILL_IN_THE_GAPS:
            return INITIAL_FILL_GAPS_ANSWER;
        case QUESTION_TYPE.RESPONSE:
            return INITIAL_RESPONSE_ANSWER;
        case QUESTION_TYPE.MATCHING:
            return INITIAL_MATCHING_ANSWER;
        case QUESTION_TYPE.TRUE_FALSE:
            return INITIAL_TRUE_FALSE_ANSWER;
        default:
            return INITIAL_MULTIPLE_CHOICES_ANSWER;
    }
};

export const questionTypeToIcon = {
    [QUESTION_TYPE.MULTIPLE_CHOICES]: faList,
    [QUESTION_TYPE.FILL_IN_THE_GAPS]: faFill,
    [QUESTION_TYPE.MATCHING]: faUpDownLeftRight,
    [QUESTION_TYPE.RESPONSE]: faPen,
    [QUESTION_TYPE.TRUE_FALSE]: faCheck,
};
