import { AxiosError } from "axios";
import { authInstance } from "../config/axios";
import { TestFormDataItf } from "../types/types";
import { toast } from "react-toastify";

export const createTest = async (testFormData: TestFormDataItf) => {
    try {
        const response = await authInstance.post("/tests", testFormData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const addParts = async (testId: string, partsBody: number) => {
    const response = await authInstance.post(
        `/tests/${testId}/parts`,
        partsBody
    );

    return response;
};
