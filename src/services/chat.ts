import { instance } from "../config/axios";
import { CHAT_OPTIONS } from "../config/config";
import { ChatBodyItf, MessageBody } from "../types/chat";

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
    option: CHAT_OPTIONS
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

export const updateReadMessagesByChatId = async (
    chatId: string,
    readBy: string[]
) => {
    try {
        const response = await instance.patch(`/chats/${chatId}/messages`, {
            readBy,
        });
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

export const deleteMessage = async (chatId: string, messageId: string) => {
    try {
        const response = await instance.delete(
            `/chats/${chatId}/messages/${messageId}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
