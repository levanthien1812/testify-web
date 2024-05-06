import { createSlice, CreateSliceOptions } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { authInitialStateItf } from "../types/types";

const initialState: authInitialStateItf = {
    isAuthened: Cookies.get("token") !== undefined,
    user: Cookies.get("user")
        ? JSON.parse(Cookies.get("user") as string)
        : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        register(action, payload) {},
        login(action, payload) {},
    },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
