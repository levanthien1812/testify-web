import { ColumnFiltersState } from "@tanstack/react-table";
import {
    QuestionBankBodyTempItf,
    QuestionInBankItf,
} from "../../types/questionBank";
import {
    CreateTestContext,
    EditabilityConfig,
    TakeTestContext,
    TestOptions,
    ViewTestContext,
} from "../../types/tests";
import {
    FillGapsAnswerItf,
    FillGapsQuestionItf,
    MatchingAnswerItf,
    MatchingQuestionItf,
    MultipleChoiceAnswerItf,
    MultipleChoiceQuestionItf,
    PasscodeItf,
    QuestionContentItf,
    QuestionItf,
    ResponseAnswerItf,
    ResponseQuestionItf,
    TakerBodyItf,
    TakerGroupBodyItf,
    TestBodyItf,
    TestPartItf,
    TrueFalseAnswerItf,
    TrueFalseQuestionItf,
} from "../../types/types";
import { formatTimezone } from "../../utils/time";
import {
    FILL_GAP_METHOD,
    PAGINATION_MODE,
    PASSCODE_VALID_UNIT,
    PUBLIC_ANSWERS_OPTIONS,
    QUESTION_INSTRUCTIONS,
    QUESTION_LEVEL,
    RECORD_MODE,
    SHARE_OPTIONS,
    TEST_LEVEL,
    TEST_STATUS,
} from "./tests";
import { CREATE_TEST_STEPS, QUESTION_TYPE } from "./tests";

export const INITIAL_OPTIONS: TestOptions = {
    allow_close_time: {
        enable: false,
        let_taker_know: true,
    },
    allow_view_submission_after_test: {
        enable: false,
        let_taker_know: true,
    },
    allow_multiple_submissions: {
        enable: false,
        let_taker_know: true,
        maximum_submissions: 3,
    },
    allow_save_progress: {
        enable: false,
        let_taker_know: true,
    },
    allow_show_taker_answers_after_test: {
        enable: false,
        let_taker_know: false,
    },
    allow_show_maker_answers_after_test: {
        enable: false,
        public_answers_option: PUBLIC_ANSWERS_OPTIONS.AFTER_CLOSE_TIME,
        let_taker_know: false,
    },
    allow_shuffle_questions: {
        enable: false,
        let_taker_know: false,
    },
    allow_shuffle_answers: {
        enable: false,
        let_taker_know: false,
    },
    allow_review_before_submission: {
        enable: false,
        let_taker_know: false,
    },
    disallow_time_limit: {
        enable: false,
        let_taker_know: true,
    },
    pagination_mode: {
        enable: false,
        let_taker_know: false,
        mode: PAGINATION_MODE.ALL,
        allow_back_navigation: false,
        require_completion_before_next: false,
    },
    require_screen_recorder: {
        enable: false,
        let_taker_know: false,
        record_mode: RECORD_MODE.SCREEN_SHOTS,
    },
    require_camera_on: {
        enable: false,
        let_taker_know: false,
        record_mode: RECORD_MODE.SCREEN_SHOTS,
    },
};

export const INITIAL_TEST_INFO: TestBodyItf = {
    title: "lskjfklsa",
    datetime: formatTimezone(new Date()),
    description: "",
    duration: 10,
    max_score: 10,
    num_questions: 10,
    level: TEST_LEVEL.EASY,
    num_parts: 1,
    options: INITIAL_OPTIONS,
};

export const DRAFT_EDITIBILITY_CONFIG: EditabilityConfig = {
    [CREATE_TEST_STEPS.TEST_INFORMATION]: {
        title: true,
        datetime: true,
        description: true,
        duration: true,
        max_score: true,
        num_questions: true,
        num_parts: true,
        level: true,
        options: {
            allow_close_time: true,
            allow_view_submission_after_test: true,
            allow_multiple_submissions: true,
            allow_save_progress: true,
            allow_show_taker_answers_after_test: true,
            allow_show_maker_answers_after_test: true,
            allow_shuffle_questions: true,
            allow_shuffle_answers: true,
            allow_review_before_submission: true,
            disallow_time_limit: true,
            pagination_mode: true,
            require_screen_recorder: true,
            require_camera_on: true,
        },
    },
    [CREATE_TEST_STEPS.TEST_PARTS]: {
        name: true,
        score: true,
        description: true,
        num_questions: true,
        order: true,
    },
    [CREATE_TEST_STEPS.TEST_QUESTIONS]: {
        score: true,
        level: true,
        type: true,
        order: true,
        content: true,
        partial_scoring: true,
    },
    [CREATE_TEST_STEPS.TEST_ANSWERS]: {},
    [CREATE_TEST_STEPS.TEST_TAKERS]: {
        share_option: true,
    },
};

export const PUBLISHED_EDITABILITY_CONFIG: EditabilityConfig = {
    [CREATE_TEST_STEPS.TEST_INFORMATION]: {
        title: false,
        datetime: false,
        description: false,
        duration: false,
        max_score: false,
        num_questions: false,
        num_parts: false,
        level: false,
        options: {
            allow_close_time: false,
            allow_view_submission_after_test: true,
            allow_multiple_submissions: false,
            allow_save_progress: false,
            allow_show_taker_answers_after_test: true,
            allow_show_maker_answers_after_test: true,
            allow_shuffle_questions: false,
            allow_shuffle_answers: false,
            allow_review_before_submission: true,
            disallow_time_limit: false,
            pagination_mode: true,
            require_screen_recorder: true,
            require_camera_on: true,
        },
    },
    [CREATE_TEST_STEPS.TEST_PARTS]: {
        name: true,
        score: false,
        description: true,
        num_questions: false,
        order: false,
    },
    [CREATE_TEST_STEPS.TEST_QUESTIONS]: {
        score: false,
        level: true,
        type: false,
        order: false,
        content: true,
        partial_scoring: true,
    },
    [CREATE_TEST_STEPS.TEST_ANSWERS]: {},
    [CREATE_TEST_STEPS.TEST_TAKERS]: {
        share_option: true,
    },
};

export const OPENED_EDITABILITY_CONFIG: EditabilityConfig = {
    [CREATE_TEST_STEPS.TEST_INFORMATION]: {
        title: false,
        datetime: false,
        description: false,
        duration: false,
        max_score: false,
        num_questions: false,
        num_parts: false,
        level: false,
        options: {
            allow_close_time: false,
            allow_view_submission_after_test: true,
            allow_multiple_submissions: false,
            allow_save_progress: false,
            allow_show_taker_answers_after_test: false,
            allow_show_maker_answers_after_test: false,
            allow_shuffle_questions: false,
            allow_shuffle_answers: false,
            allow_review_before_submission: false,
            disallow_time_limit: false,
            pagination_mode: true,
            require_camera_on: true,
            require_screen_recorder: true,
        },
    },
    [CREATE_TEST_STEPS.TEST_PARTS]: {
        name: true,
        score: false,
        description: true,
        num_questions: false,
        order: false,
    },
    [CREATE_TEST_STEPS.TEST_QUESTIONS]: {
        score: false,
        level: true,
        type: false,
        order: false,
        content: true,
        partial_scoring: true,
    },
    [CREATE_TEST_STEPS.TEST_ANSWERS]: {},
    [CREATE_TEST_STEPS.TEST_TAKERS]: {
        share_option: false,
    },
};

export const CLOSED_EDITABILITY_CONFIG: EditabilityConfig = {
    [CREATE_TEST_STEPS.TEST_INFORMATION]: {
        title: false,
        datetime: false,
        description: false,
        duration: false,
        max_score: false,
        num_questions: false,
        num_parts: false,
        level: false,
        options: {
            allow_close_time: false,
            allow_view_submission_after_test: false,
            allow_multiple_submissions: false,
            allow_save_progress: false,
            allow_show_taker_answers_after_test: false,
            allow_show_maker_answers_after_test: false,
            allow_shuffle_questions: false,
            allow_shuffle_answers: false,
            allow_review_before_submission: false,
            disallow_time_limit: false,
            pagination_mode: false,
            require_camera_on: false,
            require_screen_recorder: false,
        },
    },
    [CREATE_TEST_STEPS.TEST_PARTS]: {
        name: false,
        score: false,
        description: false,
        num_questions: false,
        order: false,
    },
    [CREATE_TEST_STEPS.TEST_QUESTIONS]: {
        score: false,
        level: false,
        type: false,
        order: false,
        content: false,
        partial_scoring: false,
    },
    [CREATE_TEST_STEPS.TEST_ANSWERS]: {},
    [CREATE_TEST_STEPS.TEST_TAKERS]: {
        share_option: false,
    },
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
    numParts: 0,
    level: TEST_LEVEL.EASY,
    shareOption: SHARE_OPTIONS.RESTRICTED,
    testParts: [],
    testQuestions: [],
    isValidTestInfo: false,
    isValidCurrentPart: false,
    isValidQuestions: false,
    isValidAnswers: false,
    isValidParts: false,
    isValidShareOption: false,
    selectedTestTakers: [],
    joinedTakers: [],
    availableTakers: [],
    testLink: "",
    passcode: {
        code: "",
        valid_till: new Date().toISOString(),
        valid_in: 1,
        valid_unit: PASSCODE_VALID_UNIT.MINUTES,
        method: "",
    },
    options: INITIAL_OPTIONS,
    status: TEST_STATUS.DRAFT,
    editibility: DRAFT_EDITIBILITY_CONFIG,
    includesManuallyScoredQuestions: false,
    openAllParts: false,
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
    instruction_text: QUESTION_INSTRUCTIONS.MULTIPLE_CHOICES_SINGLE,
};

export const INITIAL_FILL_GAPS_QUESTION: FillGapsQuestionItf = {
    text: "",
    num_gaps: 1,
    fill_method: FILL_GAP_METHOD.DRAG_DROP,
    json_text: "",
    given_words: [],
    instruction_text: QUESTION_INSTRUCTIONS.FILL_IN_THE_GAPS,
};

export const INITIAL_MATCHING_QUESTION: MatchingQuestionItf = {
    left_items: [{ text: "" }, { text: "" }],
    right_items: [{ text: "" }, { text: "" }],
    text: "",
    instruction_text: QUESTION_INSTRUCTIONS.MATCHING,
};

export const INITIAL_RESPONSE_QUESTION: ResponseQuestionItf = {
    text: "",
    instruction_text: QUESTION_INSTRUCTIONS.RESPONSE,
};

export const INITIAL_TRUE_FALSE_QUESTION: TrueFalseQuestionItf = {
    text: "",
    instruction_text: QUESTION_INSTRUCTIONS.TRUE_FALSE,
};

export const INITIAL_MULTIPLE_CHOICES_ANSWER: MultipleChoiceAnswerItf = {
    options: [],
};

export const INITIAL_FILL_GAPS_ANSWER: FillGapsAnswerItf = {
    gaps: [],
};

export const INITIAL_MATCHING_ANSWER: MatchingAnswerItf = {
    matchings: [],
};

export const INITIAL_RESPONSE_ANSWER: ResponseAnswerItf = {
    response: "",
};

export const INITIAL_TRUE_FALSE_ANSWER: TrueFalseAnswerItf = {
    is_true: false,
};

export const INITIAL_QUESTION: QuestionItf<QuestionContentItf> = {
    level: QUESTION_LEVEL.NONE,
    order: 0,
    score: 1,
    test_id: "",
    type: QUESTION_TYPE.MULTIPLE_CHOICES,
    content: INITIAL_MULTIPLE_CHOICES_QUESTION,
    partial_scoring: false,
};

export const INITIAL_QUESTION_IN_BANK: QuestionInBankItf<QuestionContentItf> = {
    level: QUESTION_LEVEL.NONE,
    score: 1,
    type: QUESTION_TYPE.MULTIPLE_CHOICES,
    content: INITIAL_MULTIPLE_CHOICES_QUESTION,
};

export const INITIAL_TAKE_TEST_CONTEXT: TakeTestContext = {
    answers: [],
    closeTime: new Date(),
    startTime: new Date(),
    test: null,
    submissions: [],
    testStatus: TEST_STATUS.DRAFT,
    startable: false,
    isStarted: false,
    isEnded: false,
    isForbidden: false,
    includeTakerAnswers: false,
    submittable: false,
    passcode: {
        code: "",
        valid_till: new Date().toISOString(),
        valid_in: 0,
        method: "",
    },
    enteredPasscode: "",
    testLink: "",
    isEnteringPasscode: false,
    isPasscodeValidated: false,
    submissionsCount: 0,
    canAccessCamera: false,
    canAccessScreen: false,
    isUploadingMedia: false,
    uploadProgress: 0,
};

export const INITIAL_VIEW_TEST_CONTEXT: ViewTestContext = {
    test: null,
    submissions: [],
    questionsResult: [],
    currentSubmissionBeingViewed: null,
};

export const INITIAL_QUESTION_BANK: QuestionBankBodyTempItf = {
    name: "",
    description: "",
    tags: [],
    is_bookmarked: false,
};

export const INITIAL_TAKER: TakerBodyItf = {
    name: "",
    email: "",
};

export const INITIAL_USER: TakerBodyItf = {
    name: "",
    email: "",
};

export const INITIAL_TAKER_GROUP: TakerGroupBodyItf = {
    name: "",
};

export const INITIAL_TAKERS_COLUMN_FILTERS: ColumnFiltersState = [
    {
        id: "name",
        value: "",
    },
];

export const INITIAL_PASSCODE: PasscodeItf = {
    code: "",
    valid_till: new Date().toISOString(),
    valid_in: 0,
    valid_unit: PASSCODE_VALID_UNIT.MINUTES,
    method: "",
};
