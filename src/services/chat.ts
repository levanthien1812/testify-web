import { instance } from "../config/axios";
import { chatOptions } from "../config/config";
import { ChatBodyItf, MessageBody } from "../types/types";

export const getChats = async () => {
    try {
        const response = await instance.get("/chats");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createChats = async (
    chatsBody: ChatBodyItf,
    option: (typeof chatOptions)[keyof typeof chatOptions]
) => {
    try {
        const response = await instance.post(
            `/chats?option=${option}`,
            chatsBody
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const sendMessage = async (messageBody: MessageBody) => {
    try {
        const response = await instance.post(
            `/chats/${messageBody.chat_id}/messages`,
            messageBody
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMessages = async (chatId: string) => {
    try {
        const response = await instance.get(`/chats/${chatId}/messages`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
