import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./auth";
import { createTestReducer } from "./createTest";
import { takeTestReducers } from "./takeTest";
import { viewTestReducer } from "./viewTest";
import { createTestTemplateReducer } from "./createTestTemplate";

const rootReducers = combineReducers({
    auth: authReducer,
    createTest: createTestReducer,
    takeTest: takeTestReducers,
    viewTest: viewTestReducer,
    createTestTemplate: createTestTemplateReducer,
});

export type RootState = ReturnType<typeof rootReducers>;
