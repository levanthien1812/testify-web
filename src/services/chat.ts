import { instance } from "../config/axios";
import { CHAT_OPTIONS } from "../config/constants/chat";
import {
    AIChatBodyItf,
    ChatBodyItf,
    MessageAIBody,
    MessageBody,
} from "../types/chat";

export const getChats = async () => {
    try {
        const response = await instance.get("/chats");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateChat = async (
    chatId: string,
    chatBody: Partial<ChatBodyItf>
) => {
    try {
        const response = await instance.patch(`chats/${chatId}`, chatBody);
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

export const updateReadMessagesByChatId = async (chatId: string) => {
    try {
        const response = await instance.patch(
            `/chats/${chatId}/messages/update-readby`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const sendMessage = async (messageBody: MessageBody) => {
    try {
        const formData = new FormData();

        for (const [key, value] of Object.entries(messageBody)) {
            if (key !== "images") {
                formData.append(key, value);
            } else {
                if (messageBody.images && messageBody.images.length > 0) {
                    for (let i = 0; i < messageBody.images.length; i++) {
                        formData.append("files[]", messageBody.images[i]);
                    }
                }
            }
        }

        const response = await instance.post(
            `/chats/${messageBody.chat_id}/messages`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateMessage = async (
    messageId: string,
    messageBody: Partial<MessageBody>
) => {
    try {
        const response = await instance.patch(
            `/chats/${messageBody.chat_id}/messages/${messageId}`,
            messageBody
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMessages = async (
    chatId: string,
    query?: { limit: number; oldestMessageId?: string }
) => {
    try {
        let queryString = "";
        if (query?.limit) {
            queryString = `?limit=${query.limit}`;
        }
        if (query?.oldestMessageId) {
            queryString += `&oldestMessageId=${query.oldestMessageId}`;
        }

        const response = await instance.get(
            `/chats/${chatId}/messages${queryString}`
        );
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

export const updaetNickname = async (
    chatId: string,
    memberId: string,
    nickname: string
) => {
    try {
        const response = await instance.patch(
            `chats/${chatId}/update-nickname`,
            { memberId, nickname }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createChatAI = async (chatBody: AIChatBodyItf) => {
    try {
        const response = await instance.post("/chats/ai", chatBody);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getChatsAI = async () => {
    try {
        const response = await instance.get("/chats/ai");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createMessageAI = async (
    chatId: string,
    AIModel: string,
    content: MessageAIBody
) => {
    try {
        const response = await instance.post(
            `/chats/ai/${chatId}/messages`,
            {
                model: AIModel,
                content,
            },
            {
                timeout: 20000,
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMessagesAI = async (chatId: string) => {
    try {
        const response = await instance.get(`/chats/ai/${chatId}/messages`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getModelsAI = async () => {
    try {
        const response = await instance.get("/chats/ai/models");
        return response.data;
    } catch (error) {
        throw error;
    }
};
