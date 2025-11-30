import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INITIAL_VIEW_TEST_CONTEXT } from "../config/constants/initialValues";
import {
    QuestionContentItf,
    QuestionItf,
    TestItf,
    TestPartItf,
} from "../types/types";
import { sortQuestionsByOrder } from "../utils/test";
import { TestResult } from "../types/tests";

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

            if (state.test.num_parts === 0) {
                state.test.parts = [];
                state.test.questions = sortQuestionsByOrder(
                    action.payload.questions
                );
            } else {
                state.test.parts = action.payload.parts.map((part) => {
                    const questions = sortQuestionsByOrder(
                        part.questions || []
                    );
                    return {
                        ...part,
                        questions,
                    };
                });
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
        setScores(state, action: PayloadAction<TestResult>) {
            state.scores = {
                average: action.payload.average_score,
                highest: action.payload.highest_score,
                lowest: action.payload.lowest_score,
            };
        },
        setRates(state, action: PayloadAction<TestResult>) {
            state.rates = {
                pass: action.payload.pass_rate,
                fail: action.payload.fail_rate,
            };
        },
        setAverageTime(state, action: PayloadAction<TestResult>) {
            state.averageTime = action.payload.average_time;
        },
        reset(state) {
            return INITIAL_VIEW_TEST_CONTEXT;
        },
        setIsLoadingSubmissions(state, action) {
            state.isLoadingSubmissions = action.payload;
        },
    },
});

export const viewTestReducer = viewTestSlice.reducer;
export const viewTestActions = viewTestSlice.actions;
