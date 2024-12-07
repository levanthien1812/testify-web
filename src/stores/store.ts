import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth";
import { createTestReducer } from "./createTest";

const store = configureStore({
    reducer: {
        auth: authReducer,
        createTest: createTestReducer,
    },
});

export default store;
