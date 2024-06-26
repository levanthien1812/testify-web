export const roles = {
    TAKER: "taker",
    MAKER: "maker",
    ADMIN: "admin",
};

export const testLevels = {
    NONE: "none",
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard",
    VERY_HARD: "very hard",
};

export const questionTypes = {
    MULITPLE_CHOICES: "multiple choices",
    FILL_GAPS: "fill in the gaps",
    MATCHING: "matching",
    RESPONSE: "response",
};

export const testStatus = {
    DRAFT: "draft",
    PUBLISHABLE: "publishable",
    PUBLISHED: "published",
    OPENED: "opened",
    STARTED: "started",
    ENDED: "ended",
    CLOSED: "closed",
};

export const publicAnswersOptions = {
    AFTER_TAKER_SUBMISSION: "after taker's submission",
    AFTER_CLOSE_TIME: "after test's close time",
    SPECIFIC_DATE: "specific date",
};

export const autoScoreTypes = [
    questionTypes.FILL_GAPS,
    questionTypes.MATCHING,
    questionTypes.MULITPLE_CHOICES,
];

export const manualScoreTypes = [questionTypes.RESPONSE];
