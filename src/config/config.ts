import { QUESTION_TYPE } from "./constants/tests";

export const ROLES = {
    TAKER: "TAKER",
    MAKER: "MAKER",
    ADMIN: "ADMIN",
};

export const TEST_LEVEL = {
    NONE: "NONE",
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    HARD: "HARD",
    VERY_HARD: "VERY_HARD",
};

export const TEST_LEVEL_LABEL = {
    [TEST_LEVEL.NONE]: "None",
    [TEST_LEVEL.EASY]: "Easy",
    [TEST_LEVEL.MEDIUM]: "Medium",
    [TEST_LEVEL.HARD]: "Hard",
    [TEST_LEVEL.VERY_HARD]: "Very hard",
};

export const QUESTION_LEVEL = {
    NONE: "NONE",
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    HARD: "HARD",
    VERY_HARD: "VERY_HARD",
};

export const QUESTION_LEVEL_LABEL = {
    [QUESTION_LEVEL.NONE]: "None",
    [QUESTION_LEVEL.EASY]: "Easy",
    [QUESTION_LEVEL.MEDIUM]: "Medium",
    [QUESTION_LEVEL.HARD]: "Hard",
    [QUESTION_LEVEL.VERY_HARD]: "Very hard",
};

export const TEST_STATUS = {
    DRAFT: "DRAFT",
    PUBLISHABLE: "PUBLISHABLE",
    PUBLISHED: "PUBLISHED",
    OPENED: "OPENED",
    CLOSED: "CLOSED",
};

export const PUBLIC_ANSWERS_OPTIONS = {
    AFTER_TAKER_SUBMISSION: "AFTER_TAKER_SUBMISSION",
    AFTER_CLOSE_TIME: "AFTER_CLOSE_TIME",
    SPECIFIC_DATE: "SPECIFIC_DATE",
};

export const PUBLIC_ANSWERS_OPTIONS_LABEL = {
    [PUBLIC_ANSWERS_OPTIONS.AFTER_TAKER_SUBMISSION]:
        "Publish after taker's submission",
    [PUBLIC_ANSWERS_OPTIONS.AFTER_CLOSE_TIME]:
        "Publish after close time (must provide close time)",
    [PUBLIC_ANSWERS_OPTIONS.SPECIFIC_DATE]: "Publish after a specific day",
};

export const AUTO_SCORE_TYPES = [
    QUESTION_TYPE.FILL_IN_THE_GAPS,
    QUESTION_TYPE.MATCHING,
    QUESTION_TYPE.MULTIPLE_CHOICES,
];

export const MANUAL_SCORE_TYPES = [QUESTION_TYPE.RESPONSE];

export const SHARE_OPTIONS = {
    ANYONE: "ANYONE",
    RESTRICTED: "RESTRICTED",
    PASSCODE: "PASSCODE",
} as const;

export const CHAT_OPTIONS = {
    INDIVIDUAL: "INDIVIDUAL",
    GROUP: "GROUP",
};

export const DISABLE_COPY_TIMEOUT = 2000;
