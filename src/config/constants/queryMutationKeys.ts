const QUERY_KEYS = {
    GET_TEST: "get-test",
    GET_AVAILABLE_TAKERS: "get-available-takers",
    GET_TEST_SUBMISSION: "get-test-submission",
    GET_TEST_STATUS: "get-test-status",
    GET_SUBMISSION_ANSWERS: "get-test-answers",
    GET_CHAT: "get-chat",
    GET_CHATS: "get-chats",
    GET_MESSAGES: "get-messages",
    GET_ONLINE_USERS: "get-online-users",
};

const MUTATION_KEYS = {
    UPDATE_TEST: "update-test",
    VALIDATE_PARTS: "validate-parts",
    CREATE_TEST: "create-test",
    CREATE_PARTS: "create-parts",
    ADD_PART: "add-part",
    UPDATE_PART: "update-part",
    CREATE_QUESTION: "create-question",
    UPDATE_QUESTION: "update-question",
    CREATE_TAKERS: "create-takers",
    ADD_TAKER: "add-taker",
    VALIDATE_QUESTIONS: "validate-questions",
    ADD_ANSWER: "add-answer",
    GENERATE_PASSCODE: "generate-passcode",
    CHECK_PASSCODE: "check-passcode",
    SEND_MESSAGE: "send-message",
    UPDATE_MESSAGE: "update-message",
    DELETE_MESSAGE: "delete-message",
};

export { QUERY_KEYS, MUTATION_KEYS };
