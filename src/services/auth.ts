import { notAuthInstance } from "../config/axios";
import { RegisterBodyItf } from "../types/types";

export const register = async (registerBody: RegisterBodyItf) => {
    const response = await notAuthInstance.post("/auth/register", registerBody);

    console.log(response);

    return response;
};
