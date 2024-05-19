import { AxiosError } from "axios";
import { authInstance } from "../config/axios";
import {
    AnswerFormData,
    PartFormDataItf,
    QuestionFormDataItf,
    TestFormDataItf,
} from "../types/types";
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

export const updateQuestion = async (
    testId: string,
    questionId: string,
    questionBody: QuestionFormDataItf
) => {
    try {
        const response = await authInstance.patch(
            `/tests/${testId}/questions/${questionId}`,
            {
                ...questionBody,
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addAnswer = async (
    testId: string,
    questionId: string,
    answerBody: AnswerFormData
) => {
    try {
        const response = await authInstance.patch(
            `/tests/${testId}/questions/${questionId}/answer`,
            {
                ...answerBody,
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};
