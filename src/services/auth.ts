import { notAuthInstance } from "../config/axios";
import { LoginBodyItf, RegisterBodyItf } from "../types/types";

export const register = async (registerBody: RegisterBodyItf) => {
    const response = await notAuthInstance.post("/auth/register", registerBody);

    return response;
};

export const login = async (loginBody: LoginBodyItf) => {
    const response = await notAuthInstance.post("/auth/login", loginBody);

    return response;
};
