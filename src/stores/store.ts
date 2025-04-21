import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth";
import { createTestReducer } from "./createTest";
import { takeTestReducers } from "./takeTest";
import { viewTestReducer } from "./viewTest";

const store = configureStore({
    reducer: {
        auth: authReducer,
        createTest: createTestReducer,
        takeTest: takeTestReducers,
        viewTest: viewTestReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;

export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
