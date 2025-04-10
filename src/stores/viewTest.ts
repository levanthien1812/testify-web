import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_VIEW_TEST_CONTEXT } from "../config/constants/initialValues";

const viewTestSlice = createSlice({
    name: "viewTest",
    initialState: INITIAL_VIEW_TEST_CONTEXT,
    reducers: {
        setTest(state, action) {
            console.log(action.payload);
            state.test = action.payload;
        },
        setSubmission(state, action) {
            state.submissions = action.payload;
        },
    },
});

export const viewTestReducer = viewTestSlice.reducer;
export const viewTestActions = viewTestSlice.actions;
