import { HttpStatusCode } from "axios";
import { instance } from "../config/axios";
import {
    ForgotPasswordBodyItf,
    LoginBodyItf,
    RegisterBodyItf,
    ResetPasswordBodyItf,
    SendVerificationCodeBodyItf,
    VerifyEmailBodyItf,
} from "../types/types";
import Cookies from "js-cookie";

export const register = async (registerBody: RegisterBodyItf) => {
    try {
        const response = await instance.post("/auth/register", registerBody);

        return response;
    } catch (error) {
        throw error;
    }
};

export const verifyEmail = async (body: VerifyEmailBodyItf) => {
    try {
        const response = await instance.post("/auth/verify-email", body);

        return response;
    } catch (error) {
        throw error;
    }
};

export const sendVerificationCode = async (
    body: SendVerificationCodeBodyItf
) => {
    try {
        const response = await instance.post(
            "/auth/send-verification-code",
            body
        );

        return response;
    } catch (error) {
        throw error;
    }
};

export const sendResetPasswordEmail = async (body: ForgotPasswordBodyItf) => {
    try {
        const response = await instance.patch(
            "/auth/send-reset-password-email",
            body
        );

        return response;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (body: ResetPasswordBodyItf) => {
    try {
        const response = await instance.patch("/auth/reset-password", body);

        return response;
    } catch (error) {
        throw error;
    }
};

export const login = async (loginBody: LoginBodyItf) => {
    try {
        const response = await instance.post("/auth/login", loginBody);

        return response;
    } catch (error) {
        throw error;
    }
};

export const loginGoogle = async (token: string) => {
    const response = await instance.post("/auth/loginGoogle", { token });

    return response;
};

export const refreshToken = async (refreshToken: string) => {
    const response = await instance.post("/auth/refresh", {
        token: refreshToken,
    });

    if (response.status === HttpStatusCode.Unauthorized) {
        window.location.href = "/login";
        localStorage.clear();
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("user");
    }

    return response.data;
};

export const logout = async (refreshToken: string) => {
    const response = await instance.post("/auth/logout", {
        refreshToken: refreshToken,
    });

    return response;
};
