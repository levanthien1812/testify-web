import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INITIAL_VIEW_TEST_CONTEXT } from "../config/constants/initialValues";
import {
    QuestionContentItf,
    QuestionItf,
    TestItf,
    TestPartItf,
} from "../types/types";
import { sortQuestionsByOrder } from "../utils/test";

const viewTestSlice = createSlice({
    name: "viewTest",
    initialState: INITIAL_VIEW_TEST_CONTEXT,
    reducers: {
        setTest(
            state,
            action: PayloadAction<{
                test: TestItf;
                parts: TestPartItf[];
                questions: QuestionItf<QuestionContentItf>[];
            }>
        ) {
            state.test = action.payload.test;

            if (state.test.num_parts <= 1) {
                state.test.parts = [];
                state.test.questions = sortQuestionsByOrder(
                    action.payload.questions
                );
            } else {
                state.test.parts = action.payload.parts;
            }
        },
        setSubmissions(state, action) {
            state.submissions = action.payload;
        },
        setQuestionsResult(state, action) {
            state.questionsResult = action.payload;
        },
        setCurrentSubmissionBeingViewed(state, action) {
            state.currentSubmissionBeingViewed = action.payload;
        },
        updateCurrentSubmission(state, action) {
            state.currentSubmissionBeingViewed = {
                ...state.currentSubmissionBeingViewed,
                ...action.payload,
            };
        },
    },
});

export const viewTestReducer = viewTestSlice.reducer;
export const viewTestActions = viewTestSlice.actions;
