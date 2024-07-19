import { instance } from "../config/axios";
import { LoginBodyItf, RegisterBodyItf } from "../types/types";

export const register = async (registerBody: RegisterBodyItf) => {
    try {
        const response = await instance.post("/auth/register", registerBody);

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

    return response.data;
};

export const logout = async (refreshToken: string) => {
    const response = await instance.post("/auth/logout", {
        refreshToken: refreshToken,
    });

    return response;
};
