import { instance } from "../config/axios";
import { QuestionBankBodyItf } from "../types/questionBank";

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
