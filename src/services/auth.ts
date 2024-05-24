import { instance } from "../config/axios";
import { LoginBodyItf, RegisterBodyItf } from "../types/types";

export const register = async (registerBody: RegisterBodyItf) => {
    const response = await instance.post("/auth/register", registerBody);

    return response;
};

export const login = async (loginBody: LoginBodyItf) => {
    const response = await instance.post("/auth/login", loginBody);

    return response;
};

export const refreshToken = async (refreshToken: string) => {
    const response = await instance.post("/auth/refresh", {
        token: refreshToken,
    });

    return response.data;
};
