import { CreateTestContext } from "../../types/tests";
import {
    FillGapsQuestionItf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
    QuestionItf,
    ResponseQuestionItf,
    TestBodyItf,
    TestPartItf,
} from "../../types/types";
import { formatTimezone } from "../../utils/time";
import {
    PUBLIC_ANSWERS_OPTIONS,
    QUESTION_LEVEL,
    SHARE_OPTIONS,
    TEST_LEVEL,
} from "../config";
import { CREATE_TEST_STEPS, QUESTION_TYPE } from "./tests";

export const initialTestInfo: TestBodyItf = {
    title: "lskjfklsa",
    datetime: formatTimezone(new Date()),
    description: "",
    duration: 10,
    max_score: 10,
    num_questions: 10,
    level: TEST_LEVEL.EASY,
    num_parts: 1,
    enable_close_time: true,
    close_time: formatTimezone(new Date()),
    code: "",
    public_answers_date: formatTimezone(new Date()),
    public_answers_option: PUBLIC_ANSWERS_OPTIONS.SPECIFIC_DATE,
};

export const INITIAL_CREATE_TEST_CONTEXT: CreateTestContext = {
    currentStep: CREATE_TEST_STEPS.TEST_INFORMATION,
    enablePrevStep: true,
    enableNextStep: true,
    steps: [
        {
            index: 1,
            value: CREATE_TEST_STEPS.TEST_INFORMATION,
            title: "Test Information",
            isTotallyDone: false,
            isPartiallyDone: false,
            isCurrentStep: true,
        },
        {
            index: 2,
            value: CREATE_TEST_STEPS.TEST_PARTS,
            title: "Test Parts",
            isTotallyDone: false,
            isPartiallyDone: false,
            isCurrentStep: false,
        },
        {
            index: 3,
            value: CREATE_TEST_STEPS.TEST_QUESTIONS,
            title: "Test Questions",
            isTotallyDone: false,
            isPartiallyDone: false,
            isCurrentStep: false,
        },
        {
            index: 4,
            value: CREATE_TEST_STEPS.TEST_ANSWERS,
            title: "Test Answers",
            isTotallyDone: false,
            isPartiallyDone: false,
            isCurrentStep: false,
        },
        {
            index: 5,
            value: CREATE_TEST_STEPS.TEST_TAKERS,
            title: "Test Takers",
            isTotallyDone: false,
            isPartiallyDone: false,
            isCurrentStep: false,
        },
    ],
    testTitle: "",
    testDatetime: "",
    testDescription: "",
    testDuration: 0,
    testId: "",
    maxScore: 10,
    numQuestions: 1,
    numParts: 1,
    level: TEST_LEVEL.EASY,
    code: "",
    enableCloseTime: true,
    closeTime: "",
    shareOption: SHARE_OPTIONS.ANYONE,
    publicAnswersOption: PUBLIC_ANSWERS_OPTIONS.SPECIFIC_DATE,
    publicAnswersDate: "",
    testParts: [],
    testQuestions: [],
    isValidTestInfo: false,
    isValidCurrentPart: false,
    isValidQuestions: false,
    isValidParts: false,
    testTakers: [],
    availableTakers: [],
};

export const INITIAL_PART: TestPartItf = {
    name: "",
    score: 0,
    description: "",
    num_questions: 0,
    order: 0,
};

export const INITIAL_MULTIPLE_CHOICES_QUESTION: MultipleChoiceQuestionItf = {
    options: [{ text: "" }, { text: "" }],
    text: "",
    allow_multiple: false,
};

export const INITIAL_FILL_GAPS_QUESTION: FillGapsQuestionItf = {
    text: "",
    num_gaps: 0,
};

export const INITIAL_MATCHING_QUESTION: MatchingQuestionItf = {
    left_items: [],
    right_items: [],
    text: "",
};

export const INITIAL_RESPONSE_QUESTION: ResponseQuestionItf = {
    text: "",
};

export const INITIAL_QUESTION: QuestionItf = {
    level: QUESTION_LEVEL.EASY,
    order: 0,
    score: 1,
    test_id: "",
    type: QUESTION_TYPE.MULTIPLE_CHOICES,
    content: INITIAL_MULTIPLE_CHOICES_QUESTION,
};
