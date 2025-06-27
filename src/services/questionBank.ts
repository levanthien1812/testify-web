import { instance } from "../config/axios";
import { QuestionBankBodyItf } from "../types/questionBank";
import { QuestionBodyContentItf, QuestionBodyItf } from "../types/types";

export const getQuestionBanks = async () => {
    try {
        const response = await instance.get("/question-banks");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createQuestionBank = async (data: QuestionBankBodyItf) => {
    try {
        const response = await instance.post("/question-banks", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateQuestionBank = async (
    id: string,
    data: Partial<QuestionBankBodyItf>
) => {
    try {
        const response = await instance.patch(`/question-banks/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteQuestionBank = async (id: string) => {
    try {
        const response = await instance.delete(`/question-banks/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getQuestionBank = async (id: string) => {
    try {
        const response = await instance.get(`/question-banks/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createQuestion = async (
    bankId: string,
    questionBody: QuestionBodyItf<QuestionBodyContentItf>
) => {
    try {
        const response = await instance.post(
            `/question-banks/${bankId}/questions`,
            questionBody
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const importQuestionToBank = async (
    bankId: string,
    questionBody: { questions: string[] }
) => {
    try {
        const response = await instance.patch(
            `/question-banks/${bankId}/questions/import`,
            questionBody
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateQuestion = async (
    bankId: string,
    questionId: string,
    questionBody: Partial<QuestionBodyItf<QuestionBodyContentItf>>
) => {
    try {
        const response = await instance.patch(
            `/question-banks/${bankId}/questions/${questionId}`,
            questionBody
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteQuestion = async (bankId: string, questionId: string) => {
    try {
        const response = await instance.delete(
            `/question-banks/${bankId}/questions/${questionId}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
