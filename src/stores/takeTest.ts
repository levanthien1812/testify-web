import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INITIAL_TAKE_TEST_CONTEXT } from "../config/constants/initialValues";
import {
    AnswerBodyContentItf,
    PasscodeItf,
    QuestionContentItf,
    QuestionItf,
    TestItf,
    UserAnswerItf,
} from "../types/types";
import { TEST_STATUS } from "../config/constants/tests";

const TakeTestSlice = createSlice({
    initialState: INITIAL_TAKE_TEST_CONTEXT,
    name: "take-test",
    reducers: {
        setTest(state, action: PayloadAction<TestItf>) {
            state.test = action.payload;

            state.test.parts = state.test.parts?.map((part) => {
                if (part.questions && part.questions.length > 0) {
                    part.questions = part.questions.map((question) => {
                        let answer = null;
                        if (question?.content?.answer) {
                            answer = {
                                ...question?.content?.answer,
                                is_saved: true,
                            };
                        }
                        return {
                            ...question,
                            content: {
                                ...question.content,
                                answer: answer,
                            } as QuestionContentItf,
                        };
                    });
                }
                return part;
            });
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
            action: PayloadAction<UserAnswerItf<AnswerBodyContentItf>>
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
                const questionIds = questions.map((question) => question.id!);
                state.answers = questionIds.map((id) => ({ question_id: id }));
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
    },
});

export const takeTestReducers = TakeTestSlice.reducer;
export const takeTestActions = TakeTestSlice.actions;
