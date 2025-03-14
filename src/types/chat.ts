import { Socket } from "socket.io-client";
import { userItf } from "./types";
import { MutableRefObject } from "react";
import { MESSAGE_TYPE, NOTIFICATION_TYPE } from "../config/constants/chat";

export interface ChatBodyItf {
    members: string[];
    appearances?: {
        background_color: string;
        messages_color: string;
        messages_font_size: string;
    };
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
        messages_font_size: string;
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
    fetch_times?: number;
    scroll_position?: number;
    is_accessed?: boolean;
    search_string?: string;
    search_result_no?: number;
    search_index?: number;
    search_result_total?: number;
    prev_search_message_id?: string;
    curr_search_message_id?: string;
}

export interface MessageBody {
    chat_id: string;
    text: string;
    images?: FileList;
    read_by?: string[];
    reply_to?: string;
    reactions?: ReactionEmoji[];
}

export interface MessageItf {
    id: string;
    text: string;
    sender_id: string;
    chat_id: string;

    type: MESSAGE_TYPE;
    created_at: Date;
    updated_at: Date;
    deleted?: boolean;
    images?: string[];
    reply_to?: string;
    reactions?: ReactionEmoji[];
    remove_for?: string[];
    read_by: string[];
    is_read: boolean;
    notification_type?: NOTIFICATION_TYPE;
    link_preview?: string;
    links?: string[];
}

export interface ChatContext {
    socket: Socket | null;
    onlineUsers: {
        user_id: string;
        socket_id: string;
    }[];
    chats: ChatItf[] | null;
    currentChat: ChatItf | null;
    isOpeningChatInfo: boolean;
    setIsOpeningChatInfo: (isOpeningChatInfo: boolean) => void;
    setCurrentChat: (chat: ChatItf | null) => void;
    setChats: (chats: ChatItf[] | null) => void;
    updateChatInChats: (chatId: string, chatBody: Partial<ChatItf>) => void;
    sendMessage: (message: MessageItf) => void;
    removeMessage: (messageId: string) => void;
    emitTyping: (isTyping: boolean, chatId: string) => void;
    findSearchResult: () => void;
    incrementFetchTimes: () => void;
    cancelSearching: () => void;
    updateNickname: (
        chatId: string,
        memberId: string,
        nickname: string
    ) => void;
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
