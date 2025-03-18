import { createSlice } from "@reduxjs/toolkit";
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
        authenticate(state, action) {
            const user: userItf = action.payload.user;
            const tokens = action.payload.tokens;

            Cookies.set("user", JSON.stringify(user), {
                expires: new Date(tokens.refresh.expires),
            });
            Cookies.set("access_token", tokens.access.token, {
                expires: new Date(tokens.access.expires),
            });
            Cookies.set("refresh_token", tokens.refresh.token, {
                expires: new Date(tokens.refresh.expires),
            });

            state.user = user;
            state.isAuthened = true;
        },

        logout(state) {
            state.user = null;
            state.isAuthened = false;
            Cookies.remove("user");
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
        },

        blockUser(state, action) {
            if (!state.user) return;
            if (!state.user.blocked_users) {
                state.user.blocked_users = [];
            }

            const blockedUserId = action.payload;
            if (!state.user?.blocked_users.includes(blockedUserId)) {
                state.user?.blocked_users.push(blockedUserId);
            }
        },
    },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
