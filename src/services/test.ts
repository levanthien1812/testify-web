import { AxiosError } from "axios";
import { instance } from "../config/axios";
import {
    AnswerFormData,
    PartFormDataItf,
    QuestionFormDataItf,
    TakerFormDataItf,
    TestFormDataItf,
} from "../types/types";
import { toast } from "react-toastify";

export const createTest = async (testFormData: TestFormDataItf) => {
    try {
        const response = await instance.post("/tests", testFormData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
};

export const getTest = async (testId: string) => {
    try {
        const response = await instance.get(`/tests/${testId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addPart = async (testId: string, partBody: PartFormDataItf) => {
    try {
        const response = await instance.post(
            `/tests/${testId}/parts`,
            partBody
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const validateParts = async (testId: string) => {
    try {
        const response = await instance.get(`/tests/${testId}/parts/validate`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createQuestion = async (
    testId: string,
    questionBody: QuestionFormDataItf
) => {
    try {
        const response = await instance.post(`/tests/${testId}/questions`, {
            ...questionBody,
        });
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
        const response = await instance.patch(
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

export const createTakers = async (
    testId: string,
    takersBody: {
        takers: TakerFormDataItf[];
    }
) => {
    try {
        const response = await instance.post(`/tests/${testId}/takers`, {
            takersBody,
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAvailableTakers = async (testId: string) => {
    try {
        const response = await instance.get(
            `/tests/${testId}/takers/available`
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const assignTakers = async (testId: string, takers: string[]) => {
    try {
        const response = await instance.patch(`/tests/${testId}/takers`, {
            taker_ids: takers,
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const validateQuestions = async (testId: string) => {
    try {
        const response = await instance.get(
            `/tests/${testId}/questions/validate`
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};
