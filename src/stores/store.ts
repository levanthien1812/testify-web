import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth";
import { createTestReducer } from "./createTest";
import { takeTestReducers } from "./takeTest";

const store = configureStore({
    reducer: {
        auth: authReducer,
        createTest: createTestReducer,
        takeTest: takeTestReducers,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
