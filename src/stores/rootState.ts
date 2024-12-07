import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./auth";
import { createTestReducer } from "./createTest";

const rootReducers = combineReducers({
    auth: authReducer,
    createTest: createTestReducer,
});

export type RootState = ReturnType<typeof rootReducers>;
