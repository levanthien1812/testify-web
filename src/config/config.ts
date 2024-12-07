import { QUESTION_TYPE } from "./constants/tests";

export const ROLES = {
    TAKER: "taker",
    MAKER: "maker",
    ADMIN: "admin",
};

export const TEST_LEVEL = {
    NONE: "NONE",
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    HARD: "HARD",
    VERY_HARD: "VERY_HARD",
};

export const QUESTION_LEVEL = {
    NONE: "NONE",
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    HARD: "HARD",
    VERY_HARD: "VERY_HARD",
};

export const TEST_STATUS = {
    DRAFT: "DRAFT",
    PUBLISHABLE: "PUBLISHABLE",
    PUBLISHED: "PUBLISHED",
    OPENED: "OPENED",
    STARTED: "STARTED",
    ENDED: "ENDED",
    CLOSED: "CLOSED",
};

export const PUBLIC_ANSWERS_OPTIONS = {
    AFTER_TAKER_SUBMISSION: "AFTER_TAKER_SUBMISSION",
    AFTER_CLOSE_TIME: "AFTER_CLOSE_TIME",
    SPECIFIC_DATE: "SPECIFIC_DATE",
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
} as const;

export const CHAT_OPTIONS = {
    INDIVIDUAL: "INDIVIDUAL",
    GROUP: "GROUP",
};
