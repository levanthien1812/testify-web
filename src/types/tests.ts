import {
    PUBLIC_ANSWERS_OPTIONS,
    SHARE_OPTIONS,
    TEST_LEVEL,
    TEST_STATUS,
} from "../config/config";
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
export interface TestOption {
    allow_close_time: {
        enable: boolean;
        close_time?: string;
    };
    allow_view_submission_after_test: {
        enable: boolean;
    };
    allow_multiple_submissions: {
        enable: boolean;
        maximum_submissions?: number;
    };
    allow_save_progress: {
        enable: boolean;
    };
    allow_show_taker_answers_after_test: {
        enable: boolean;
        delay_time?: number;
    };
    allow_show_maker_answers_after_test: {
        enable: boolean;
        visibility_level?: PUBLIC_ANSWER_VISIBILITY_LEVEL;
        public_answers_option: PUBLIC_ANSWERS_OPTIONS;
        public_answers_date?: string;
    };
    allow_shuffle_questions: {
        enable: boolean;
    };
    allow_shuffle_answers: {
        enable: boolean;
    };
    allow_review_before_submission: {
        enable: boolean;
    };
    disallow_time_limit: {
        enable: boolean;
        duration?: number;
    };
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
    testTakers: TakerItf[];
    selectedTestTakers: TakerItf[];
    joinedTakers: TakerItf[];
    availableTakers: TakerItf[];
    testLink: string;
    passcode: PasscodeItf;
    options: TestOption;
}

export interface TakeTestContext {
    test: TestItf | null;
    answers: UserAnswerItf<AnswerBodyContentItf>[];
    startTime: Date;
    closeTime: Date;
    submission: SubmissionItf[];
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
