export enum QUESTION_TYPE {
    MULTIPLE_CHOICES = "MULTIPLE_CHOICES",
    FILL_IN_THE_GAPS = "FILL_IN_THE_GAPS",
    MATCHING = "MATCHING",
    RESPONSE = "RESPONSE",
}

export const QUESTION_TYPE_LABEL: Record<QUESTION_TYPE, string> = {
    [QUESTION_TYPE.MULTIPLE_CHOICES]: "Multiple choices",
    [QUESTION_TYPE.FILL_IN_THE_GAPS]: "Fill in the gaps",
    [QUESTION_TYPE.MATCHING]: "Matching",
    [QUESTION_TYPE.RESPONSE]: "Response",
};

export enum CREATE_TEST_STEPS {
    TEST_INFORMATION = "TEST_INFORMATION",
    TEST_PARTS = "TEST_PARTS",
    TEST_QUESTIONS = "TEST_QUESTIONS",
    TEST_ANSWERS = "TEST_ANSWERS",
    TEST_TAKERS = "TEST_TAKERS",
}

export enum PUBLIC_ANSWER_VISIBILITY_LEVEL {
    SUMMARY = "SUMMARY",
    DETAILED = "DETAILED",
}

export const DISABLE_COPY_TIMEOUT = 2000;

export enum ROLES {
    TAKER = "TAKER",
    MAKER = "MAKER",
    ADMIN = "ADMIN",
}

export enum TEST_LEVEL {
    NONE = "NONE",
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
    VERY_HARD = "VERY_HARD",
}

export const TEST_LEVEL_LABEL: Record<TEST_LEVEL, string> = {
    [TEST_LEVEL.NONE]: "None",
    [TEST_LEVEL.EASY]: "Easy",
    [TEST_LEVEL.MEDIUM]: "Medium",
    [TEST_LEVEL.HARD]: "Hard",
    [TEST_LEVEL.VERY_HARD]: "Very hard",
};

export enum QUESTION_LEVEL {
    NONE = "NONE",
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
    VERY_HARD = "VERY_HARD",
}

export const QUESTION_LEVEL_LABEL: Record<QUESTION_LEVEL, string> = {
    [QUESTION_LEVEL.NONE]: "None",
    [QUESTION_LEVEL.EASY]: "Easy",
    [QUESTION_LEVEL.MEDIUM]: "Medium",
    [QUESTION_LEVEL.HARD]: "Hard",
    [QUESTION_LEVEL.VERY_HARD]: "Very hard",
};

export enum TEST_STATUS {
    DRAFT = "DRAFT",
    PUBLISHABLE = "PUBLISHABLE",
    PUBLISHED = "PUBLISHED",
    OPENED = "OPENED",
    CLOSED = "CLOSED",
}

export enum PUBLIC_ANSWERS_OPTIONS {
    AFTER_TAKER_SUBMISSION = "AFTER_TAKER_SUBMISSION",
    AFTER_CLOSE_TIME = "AFTER_CLOSE_TIME",
    SPECIFIC_DATE = "SPECIFIC_DATE",
}

export const PUBLIC_ANSWERS_OPTIONS_LABEL: Record<
    PUBLIC_ANSWERS_OPTIONS,
    string
> = {
    [PUBLIC_ANSWERS_OPTIONS.AFTER_TAKER_SUBMISSION]:
        "Publish after taker's submission",
    [PUBLIC_ANSWERS_OPTIONS.AFTER_CLOSE_TIME]:
        "Publish after close time (must provide close time)",
    [PUBLIC_ANSWERS_OPTIONS.SPECIFIC_DATE]: "Publish after a specific day",
};

export const AUTO_SCORE_TYPES: QUESTION_TYPE[] = [
    QUESTION_TYPE.FILL_IN_THE_GAPS,
    QUESTION_TYPE.MATCHING,
    QUESTION_TYPE.MULTIPLE_CHOICES,
];

export const MANUAL_SCORE_TYPES: QUESTION_TYPE[] = [QUESTION_TYPE.RESPONSE];

export enum SHARE_OPTIONS {
    ANYONE = "ANYONE",
    RESTRICTED = "RESTRICTED",
    PASSCODE = "PASSCODE",
}

export const TEST_OPTIONS_LABELS: Record<
    string,
    { MAKER: string; TAKER: string }
> = {
    ALLOW_CLOSE_TIME: {
        MAKER: "Allow close time",
        TAKER: "Has close time",
    },
    ALLOW_VIEW_SUBMISSION_AFTER_TEST: {
        MAKER: "Allow view submissions",
        TAKER: "Can view submission after test",
    },
    ALLOW_MULTIPLE_SUBMISSIONS: {
        MAKER: "Allow multiple submissions",
        TAKER: "Can submit multiple times",
    },
    ALLOW_SAVE_PROGRESS: {
        MAKER: "Allow save progress",
        TAKER: "Can save progress",
    },
    ALLOW_SHOW_TAKER_ANSWERS_AFTER_TEST: {
        MAKER: "Allow show taker answers",
        TAKER: "Can view your answers after test",
    },
    ALLOW_SHOW_MAKER_ANSWERS_AFTER_TEST: {
        MAKER: "Allow show correct answers",
        TAKER: "Can view correct answers after test",
    },
    ALLOW_SHUFFLE_QUESTIONS: {
        MAKER: "Allow shuffle questions",
        TAKER: "Questions are shuffled",
    },
    ALLOW_SHUFFLE_ANSWERS: {
        MAKER: "Allow shuffle answers",
        TAKER: "Answers are shuffled",
    },
    ALLOW_REVIEW_BEFORE_SUBMISSION: {
        MAKER: "Allow review before submission",
        TAKER: "Can review before submitting",
    },
    DISALLOW_TIME_LIMIT: {
        MAKER: "Disallow time limit",
        TAKER: "No time limit",
    },
    PAGINATION_MODE: {
        MAKER: "Pagination mode",
        TAKER: "Pagination mode",
    },
};

export const ALLOWED_MAXIMUM_SUBMISSIONS = 10;

export enum USER_ANSWER_STATUS {
    WRONG = "WRONG",
    CORRECT = "CORRECT",
    NOT_ANSWERED = "NOT_ANSWERED",
    PARTIALLY_CORRECT = "PARTIALLY_CORRECT",
    NOT_EVALUATED = "NOT_EVALUATED",
    MANUALLY_SCORED = "MANUALLY_SCORED",
    NOTHING = "NOTHING",
}

export const USER_ANSWER_STATUS_LABEL: Record<USER_ANSWER_STATUS, string> = {
    [USER_ANSWER_STATUS.WRONG]: "Wrong ❌",
    [USER_ANSWER_STATUS.CORRECT]: "Correct ✅",
    [USER_ANSWER_STATUS.NOT_ANSWERED]: "Not answered",
    [USER_ANSWER_STATUS.PARTIALLY_CORRECT]: "Partially correct",
    [USER_ANSWER_STATUS.NOT_EVALUATED]: "Not evaluated",
    [USER_ANSWER_STATUS.MANUALLY_SCORED]: "Manually scored",
    [USER_ANSWER_STATUS.NOTHING]: "",
};

export enum PAGINATION_MODE {
    ONE_QUESTION = "ONE_QUESTION_PER_PAGE",
    ONE_PARTS = "ONE_PART_PER_PAGE",
    ALL = "ALL_QUESTIONS_PER_PAGE",
    FIXED_PER_PAGE = "FIXED_PER_PAGE",
}

export const PAGINATION_MODE_LABEL: Record<PAGINATION_MODE, string> = {
    [PAGINATION_MODE.ONE_QUESTION]: "One question per page",
    [PAGINATION_MODE.ONE_PARTS]: "One part per page",
    [PAGINATION_MODE.ALL]: "All questions on one page",
    [PAGINATION_MODE.FIXED_PER_PAGE]: "Fixed questions quantity per page",
};

export enum PASSCODE_VALID_UNIT {
    MINUTES = "MINUTES",
    HOURS = "HOURS",
    DAYS = "DAYS",
}

export const MILISECONDS_BY_UNIT = {
    [PASSCODE_VALID_UNIT.MINUTES]: 60 * 1000,
    [PASSCODE_VALID_UNIT.HOURS]: 3600 * 1000,
    [PASSCODE_VALID_UNIT.DAYS]: 86400 * 1000,
};
