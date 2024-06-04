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
        authenticate(action, payload) {
            const user: userItf = payload.payload.user;
            const tokens = payload.payload.tokens;

            Cookies.set("user", JSON.stringify(user), {
                expires: new Date(tokens.access.expires),
            });
            Cookies.set("access_token", tokens.access.token, {
                expires: new Date(tokens.access.expires),
            });
            Cookies.set("refresh_token", tokens.refresh.token, {
                expires: new Date(tokens.refresh.expires),
            });

            action.user = user;
            action.isAuthened = true;
        },

        logout(action) {
            action.user = null;
            action.isAuthened = false;
            Cookies.remove("user");
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
        },
    },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
