import { AxiosError } from "axios";
import { authInstance } from "../config/axios";
import { PartFormDataItf, TestFormDataItf } from "../types/types";
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

export const getTest = async (testId: string) => {
    try {
        const response = await authInstance.get(`/tests/${testId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addParts = async (
    testId: string,
    partsBody: PartFormDataItf[]
) => {
    try {
        const response = await authInstance.post(`/tests/${testId}/parts`, {
            parts: partsBody,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
