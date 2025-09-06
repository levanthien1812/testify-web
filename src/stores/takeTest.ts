import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INITIAL_TAKE_TEST_CONTEXT } from "../config/constants/initialValues";
import {
    AnswerContentItf,
    PasscodeItf,
    QuestionContentItf,
    QuestionItf,
    TestItf,
    TestPartItf,
    UserAnswerBodyItf,
} from "../types/types";
import { TEST_STATUS } from "../config/constants/tests";
import { sortQuestionsByOrder } from "../utils/test";
import { getInitialAnswerContent } from "../utils/mapping";

const TakeTestSlice = createSlice({
    initialState: INITIAL_TAKE_TEST_CONTEXT,
    name: "take-test",
    reducers: {
        setTest(
            state,
            action: PayloadAction<{
                test: TestItf;
                parts: TestPartItf[];
                questions: QuestionItf<QuestionContentItf>[];
                submissionsCount?: number;
            }>
        ) {
            state.test = action.payload.test;

            if (state.test.num_parts === 0) {
                state.test.parts = [];
                state.test.questions = sortQuestionsByOrder(
                    action.payload.questions
                );
            } else {
                state.test.parts = action.payload.parts;
            }

            state.submissionsCount = action.payload.submissionsCount || 0;
        },
        setTestStatus(state, action: PayloadAction<TEST_STATUS>) {
            state.testStatus = action.payload;
            if (action.payload === TEST_STATUS.OPENED) {
                state.startable = true;
            } else {
                state.startable = false;
            }
        },
        setForbidden(state, action) {
            state.isForbidden = action.payload;
        },
        setIncludeTakerAnswers(state, action) {
            state.includeTakerAnswers = action.payload;
        },
        setIsEnded(state, action) {
            state.isEnded = action.payload;
        },
        addAnswer(
            state,
            action: PayloadAction<UserAnswerBodyItf<AnswerContentItf>>
        ) {
            let index = state.answers.findIndex(
                (ans) => ans.question_id === action.payload.question_id
            );
            state.answers[index] = {
                ...state.answers[index],
                ...action.payload,
            };

            if (
                state.test &&
                state.test.num_questions !==
                    state.answers.filter((ans) => ans.content).length
            ) {
                state.submittable = false;
            } else {
                state.submittable = true;
            }
        },
        initAnswers(state) {
            if (state.test && state.isStarted && state.answers.length === 0) {
                let questions: QuestionItf<QuestionContentItf>[];
                if (state.test.num_parts > 1 && state.test.parts) {
                    questions = state.test.parts.reduce(
                        (prev: QuestionItf<QuestionContentItf>[], curr) => [
                            ...prev,
                            ...curr.questions!,
                        ],
                        []
                    );
                } else {
                    questions = state.test.questions!;
                }
                state.answers = questions.map((question) => ({
                    question_id: question.id!,
                    content: getInitialAnswerContent(question.type),
                }));
            }
        },
        setSubmissionAnswers(state, action) {
            state.submissions = state.submissions.map((submission) => {
                if (submission.id === action.payload.submissionId) {
                    return {
                        ...submission,
                        answers: action.payload.answers,
                    };
                }
                return submission;
            });
        },
        setSubmittable(state, action) {
            state.submittable = action.payload;
        },
        setStartable(state, action) {
            state.startable = action.payload;
        },
        setIsStarted(state, action) {
            state.isStarted = action.payload;
        },
        setPasscode(state, action: PayloadAction<Partial<PasscodeItf>>) {
            state.passcode = { ...state.passcode, ...action.payload };
        },
        setIsEnteringPasscode(state, action) {
            state.isEnteringPasscode = action.payload;
        },
        setIsPasscodeValidated(state, action) {
            state.isPasscodeValidated = action.payload;
        },
        setSubmissions(state, action) {
            state.submissions = action.payload;
        },
        setEnteredPasscode(state, action) {
            state.enteredPasscode = action.payload;
        },
        setCanAccessCamera(state, action) {
            state.canAccessCamera = action.payload;
        },
        setCanAccessScreen(state, action) {
            state.canAccessScreen = action.payload;
        },
        setIsUploadingMedia(state, action) {
            state.isUploadingMedia = action.payload;
        },
        setUploadProgress(state, action) {
            state.uploadProgress = action.payload;
        },
        setLatestSubmission(state, action) {
            state.latestSubmission = action.payload;
        },
        reset(state) {
            return INITIAL_TAKE_TEST_CONTEXT;
        },
    },
});

export const takeTestReducers = TakeTestSlice.reducer;
export const takeTestActions = TakeTestSlice.actions;
