import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./auth";
import { createTestReducer } from "./createTest";
import { takeTestReducers } from "./takeTest";

const rootReducers = combineReducers({
    auth: authReducer,
    createTest: createTestReducer,
    takeTest: takeTestReducers,
});

export type RootState = ReturnType<typeof rootReducers>;
