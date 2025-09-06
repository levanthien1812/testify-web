import {
    CREATE_TEST_STEPS,
    PUBLIC_ANSWERS_OPTIONS,
    QUESTION_NUMBERING_METHOD,
    RECORD_MODE,
    SHARE_OPTIONS,
    TEST_LEVEL,
    TEST_STATUS,
} from "../config/constants/tests";
import { PUBLIC_ANSWER_VISIBILITY_LEVEL } from "../config/constants/tests";
import {
    AnswerContentItf,
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

export interface PaginationMode extends BaseOption {
    mode: string;
    require_completion_before_next?: boolean;
    allow_back_navigation?: boolean;
    questions_per_page?: number;
}

export interface RequireScreenRecorder extends BaseOption {
    record_mode: RECORD_MODE;
    interval_in_seconds?: number;
    include_audio?: boolean;
}

export interface RequireCameraOn extends BaseOption {
    record_mode: RECORD_MODE;
    interval_in_seconds?: number;
    include_audio?: boolean;
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
    pagination_mode: PaginationMode;
    require_screen_recorder: RequireScreenRecorder;
    require_camera_on: RequireCameraOn;
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
    questionNumberingMethod?: QUESTION_NUMBERING_METHOD;
    shareOption?: SHARE_OPTIONS;
    testParts: TestPartItf[];
    testQuestions: QuestionItf<QuestionContentItf>[];
    isValidTestInfo: boolean;
    isValidCurrentPart: boolean;
    isValidParts: boolean;
    isValidQuestions: boolean;
    isValidAnswers: boolean;
    isValidShareOption: boolean;
    selectedTestTakers: TakerItf[];
    joinedTakers: TakerItf[];
    availableTakers: TakerItf[];
    testLink: string;
    passcode: PasscodeItf;
    options: TestOptions;
    status: TEST_STATUS;
    editibility: EditabilityConfig;
    includesManuallyScoredQuestions: boolean;
    openAllParts: boolean;
}

export interface TakeTestContext {
    test: TestItf | null;
    answers: UserAnswerItf<AnswerContentItf>[];
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
    enteredPasscode: string;
    submissionsCount: number;
    canAccessCamera: boolean;
    canAccessScreen: boolean;
    isUploadingMedia: boolean;
    uploadProgress: number;
    latestSubmission: SubmissionItf | null;
}

export interface ViewTestContext {
    test: TestItf | null;
    submissions: SubmissionItf[];
    questionsResult: QuestionResult[];
    currentSubmissionBeingViewed: SubmissionItf | null;
    scores?: {
        average: number;
        highest: number;
        lowest: number;
    };
    rates?: {
        pass: number;
        fail: number;
    };
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
            pagination_mode: boolean;
            require_screen_recorder: boolean;
            require_camera_on: boolean;
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
        partial_scoring: boolean;
    };
    [CREATE_TEST_STEPS.TEST_ANSWERS]: {};
    [CREATE_TEST_STEPS.TEST_TAKERS]: {
        share_option: boolean;
    };
}

export interface QuestionResult {
    question: QuestionItf<QuestionContentItf>;
    correct: number;
    wrong: number;
    skipped: number;
}

export interface TestResult {
    submissions: SubmissionItf[];
    total_submissions: number;
    average_score: number;
    highest_score: number;
    lowest_score: number;
    pass_rate: number;
    fail_rate: number;
}
