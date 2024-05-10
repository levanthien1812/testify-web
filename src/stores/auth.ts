import { createSlice, CreateSliceOptions } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { authInitialStateItf, userItf } from "../types/types";

const initialState: authInitialStateItf = {
    isAuthened: Cookies.get("access_token") !== undefined,
    user: Cookies.get("user")
        ? JSON.parse(Cookies.get("user") as string)
        : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        register(action, payload) {
            console.log(payload)
            const user: userItf = payload.payload.user

            action.user = user
            action.isAuthened = true
        },
        login(action, payload) {},
    },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
