import {
    PUBLIC_ANSWERS_OPTIONS,
    SHARE_OPTIONS,
    TEST_LEVEL,
    TEST_STATUS,
} from "../config/config";
import {
    AnswerBodyContentItf,
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
    level: (typeof TEST_LEVEL)[keyof typeof TEST_LEVEL];
    code: string;
    enableCloseTime: boolean;
    closeTime: string;
    shareOption?: (typeof SHARE_OPTIONS)[keyof typeof SHARE_OPTIONS];
    publicAnswersOption: (typeof PUBLIC_ANSWERS_OPTIONS)[keyof typeof PUBLIC_ANSWERS_OPTIONS];
    publicAnswersDate: string;
    testParts: TestPartItf[];
    testQuestions: QuestionItf<QuestionContentItf>[];
    isValidTestInfo: boolean;
    isValidCurrentPart: boolean;
    isValidParts: boolean;
    isValidQuestions: boolean;
    testTakers: TakerItf[];
    joinedTakers: TakerItf[];
    availableTakers: TakerItf[];
    testLink: string;
}

export interface TakeTestContext {
    test: TestItf | null;
    answers: UserAnswerItf<AnswerBodyContentItf>[];
    startTime: Date;
    closeTime: Date;
    submission: SubmissionItf[];
    testStatus: (typeof TEST_STATUS)[keyof typeof TEST_STATUS];
    startable: boolean;
    isStarted: boolean;
    isEnded: boolean;
    isForbidden: boolean;
    includeTakerAnswers: boolean;
    submittable: boolean;
}
