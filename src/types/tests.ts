import {
    CREATE_TEST_STEPS,
    PUBLIC_ANSWERS_OPTIONS,
    SHARE_OPTIONS,
    TEST_LEVEL,
    TEST_STATUS,
} from "../config/constants/tests";
import { PUBLIC_ANSWER_VISIBILITY_LEVEL } from "../config/constants/tests";
import {
    AnswerBodyContentItf,
    PasscodeItf,
    QuestionContentItf,
    QuestionItf,
    SubmissionItf,
    TakerItf,
    TestItf,
    TestPartItf,
    UserAnswerItf,
} from "./types";

export interface CreateTestStep {
    value: string;
    index: number;
    title: string;
    isTotallyDone: boolean;
    isPartiallyDone: boolean;
    isCurrentStep: boolean;
}

export interface BaseOption {
    enable: boolean;
    let_taker_know: boolean;
}

export interface AllowCloseTimeOption extends BaseOption {
    close_time?: string;
}

export interface AllowViewSubmission extends BaseOption {
    delay_time?: number;
}

export interface AllowMultipleSubmissions extends BaseOption {
    maximum_submissions?: number;
}

export interface AllowSaveProgress extends BaseOption {}

export interface AllowShowTakerAnswers extends BaseOption {
    delay_time?: number;
}

export interface AllowShowMakerAnswers extends BaseOption {
    visibility_level?: PUBLIC_ANSWER_VISIBILITY_LEVEL;
    public_answers_option: PUBLIC_ANSWERS_OPTIONS;
    public_answers_date?: string;
}

export interface AllowShuffleQuestions extends BaseOption {}

export interface AllowShuffleAnswers extends BaseOption {}

export interface AllowReviewBeforeSubmission extends BaseOption {}

export interface DisallowTimeLimit extends BaseOption {
    duration?: number;
}
export interface TestOptions {
    allow_close_time: AllowCloseTimeOption;
    allow_view_submission_after_test: AllowViewSubmission;
    allow_multiple_submissions: AllowMultipleSubmissions;
    allow_save_progress: AllowSaveProgress;
    allow_show_taker_answers_after_test: AllowShowTakerAnswers;
    allow_show_maker_answers_after_test: AllowShowMakerAnswers;
    allow_shuffle_questions: AllowShuffleQuestions;
    allow_shuffle_answers: AllowShuffleAnswers;
    allow_review_before_submission: AllowReviewBeforeSubmission;
    disallow_time_limit: DisallowTimeLimit;
}

export interface CreateTestContext {
    currentStep: string;
    enablePrevStep: boolean;
    enableNextStep: boolean;
    steps: CreateTestStep[];
    testTitle: string;
    testId?: string;
    testDatetime: string;
    testDescription: string;
    testDuration: number;
    maxScore: number;
    numQuestions: number;
    numParts: number;
    level: TEST_LEVEL;
    shareOption?: SHARE_OPTIONS;
    testParts: TestPartItf[];
    testQuestions: QuestionItf<QuestionContentItf>[];
    isValidTestInfo: boolean;
    isValidCurrentPart: boolean;
    isValidParts: boolean;
    isValidQuestions: boolean;
    isValidShareOption: boolean;
    testTakers: TakerItf[];
    selectedTestTakers: TakerItf[];
    joinedTakers: TakerItf[];
    availableTakers: TakerItf[];
    testLink: string;
    passcode: PasscodeItf;
    options: TestOptions;
    status: TEST_STATUS;
    editibility: EditabilityConfig;
}

export interface TakeTestContext {
    test: TestItf | null;
    answers: UserAnswerItf<AnswerBodyContentItf>[];
    startTime: Date;
    closeTime: Date;
    submissions: SubmissionItf[];
    testStatus: TEST_STATUS;
    startable: boolean;
    isStarted: boolean;
    isEnded: boolean;
    isForbidden: boolean;
    includeTakerAnswers: boolean;
    submittable: boolean;
    passcode: PasscodeItf;
    testLink: string;
    isEnteringPasscode: boolean;
    isPasscodeValidated: boolean;
}

export interface ViewTestContext {
    test: TestItf | null;
    submissions: SubmissionItf[];
}

export interface EditabilityConfig {
    [CREATE_TEST_STEPS.TEST_INFORMATION]: {
        title: boolean;
        datetime: boolean;
        description: boolean;
        duration: boolean;
        max_score: boolean;
        num_questions: boolean;
        num_parts: boolean;
        level: boolean;
        options: {
            allow_close_time: boolean;
            allow_view_submission_after_test: boolean;
            allow_multiple_submissions: boolean;
            allow_save_progress: boolean;
            allow_show_taker_answers_after_test: boolean;
            allow_show_maker_answers_after_test: boolean;
            allow_shuffle_questions: boolean;
            allow_shuffle_answers: boolean;
            allow_review_before_submission: boolean;
            disallow_time_limit: boolean;
        };
    };
    [CREATE_TEST_STEPS.TEST_PARTS]: {
        name: boolean;
        score: boolean;
        description: boolean;
        num_questions: boolean;
        order: boolean;
    };
    [CREATE_TEST_STEPS.TEST_QUESTIONS]: {
        score: boolean;
        level: boolean;
        type: boolean;
        order: boolean;
        content: boolean;
    };
    [CREATE_TEST_STEPS.TEST_ANSWERS]: {};
    [CREATE_TEST_STEPS.TEST_TAKERS]: {
        share_option: boolean;
    };
}
