import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth";
import { createTestReducer } from "./createTest";

const store = configureStore({
    reducer: {
        auth: authReducer,
        createTest: createTestReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
