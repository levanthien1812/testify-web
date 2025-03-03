import { Socket } from "socket.io-client";
import { userItf } from "./types";

export interface ChatBodyItf {
    members: string[];
}

export interface ChatItf {
    id: string;
    members: {
        member: userItf;
        nick_name: string | null;
    }[];
    is_group_chat: boolean;
    group_admin: string | userItf | null;
    chat_name: string | null;
    appearances: {
        background_color: string;
        messages_color: string;
    };
    unread_messages?: MessageItf[];
    last_message: MessageItf | null;
    created_at: Date;
    updated_at: Date;
    messages: MessageItf[];
    message_being_replied?: MessageItf | null;
    typing_info?: {
        sender_id: string;
        is_typing: boolean;
    };
}

export interface MessageBody {
    chat_id: string;
    text: string;
    images?: FileList;
    readBy?: string[];
    reply_to?: string;
    reactions?: ReactionEmoji[];
}

export interface MessageItf {
    id: string;
    text: string;
    sender_id: string;
    chat_id: string;

    created_at: Date;
    updated_at: Date;
    deleted?: boolean;
    images?: string[];
    reply_to?: string;
    reactions?: ReactionEmoji[];
    remove_for?: string[];
}

export interface ChatContext {
    socket: Socket | null;
    onlineUsers: {
        user_id: string;
        socket_id: string;
    }[];
    chats: ChatItf[] | null;
    currentChat: ChatItf | null;
    setCurrentChat: (chat: ChatItf | null) => void;
    setChats: (chats: ChatItf[] | null) => void;
    updateChatInChats: (chatId: string, chatBody: Partial<ChatItf>) => void;
    sendMessage: (message: MessageItf) => void;
    removeMessage: (messageId: string) => void;
    emitTyping: (isTyping: boolean, chatId: string) => void;
}

export interface Emoji {
    icon: string;
    code: string;
}

export interface ReactionEmoji {
    emoji: string;
    user_id: string;
    created_at: string;
}
