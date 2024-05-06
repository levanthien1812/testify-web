import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./auth";

const rootReducers = combineReducers({
    auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducers>;
