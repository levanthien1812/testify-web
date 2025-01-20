import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INITIAL_TAKE_TEST_CONTEXT } from "../config/constants/initialValues";
import { AnswerBodyContentItf, TestItf, UserAnswerItf } from "../types/types";
import { TEST_STATUS } from "../config/config";

const TakeTestSlice = createSlice({
    initialState: INITIAL_TAKE_TEST_CONTEXT,
    name: "take-test",
    reducers: {
        setTest(state, action: PayloadAction<TestItf>) {
            state.test = action.payload;
        },
        setTestStatus(
            state,
            action: PayloadAction<
                (typeof TEST_STATUS)[keyof typeof TEST_STATUS]
            >
        ) {
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
                state.test.num_questions !== state.answers.length
            ) {
                state.submittable = false;
            } else {
                state.submittable = true;
            }
        },
        setAnswers(state, action) {
            state.answers = action.payload;
        },
        setSubmittable(state, action) {
            state.submittable = action.payload;
        },
    },
});

export const takeTestReducers = TakeTestSlice.reducer;
export const takeTestActions = TakeTestSlice.actions;
