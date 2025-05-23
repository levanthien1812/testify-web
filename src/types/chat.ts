import { Socket } from "socket.io-client";
import { TakerItf, userItf } from "./types";
import {
    MESSAGE_AI_ROLE,
    MESSAGE_TYPE,
    NOTIFICATION_TYPE,
} from "../config/constants/chat";

export interface ChatAppearancesItf {
    background_color: string;
    messages_color: string;
    messages_font_size: string;
}

export interface ChatBodyItf {
    members: string[];
    appearances?: Partial<ChatAppearancesItf>;
}

export interface MemberItf {
    member: userItf;
    nick_name: string | null;
}

export interface ChatItf {
    id: string;
    members: MemberItf[];
    is_group_chat: boolean;
    group_admin: string | userItf | null;
    chat_name: string | null;
    appearances: ChatAppearancesItf;
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
    scroll_position?: number;
    is_accessed?: boolean;
    search_string?: string;
    search_result_no?: number;
    search_index?: number;
    search_result_total?: number;
    prev_search_message_id?: string;
    curr_search_message_id?: string;
    is_chat_blocked?: boolean;
    member_to_block?: MemberItf;
    member_to_be_blocked?: MemberItf;
    last_oldest_message_id?: string;
}

export interface AIChatMessageItf {
    role: MESSAGE_AI_ROLE;
    content: string;
    id: string;
    created_at: string;
    updated_at?: string;
}

export interface AIChatItf {
    user_id: string;
    id?: string;
    chat_name: string;
    created_at: string;
    updated_at?: string;
    messages: AIChatMessageItf[];
    last_user_message_id: string | undefined;
    last_assistant_message_id: string | undefined;
}

export interface AIChatBodyItf {
    first_message: string;
    model: string;
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

export interface AIModelsItf {
    id: string;
    object: string;
    created: number;
    owned_by: string;
}

export interface ChatContext {
    socket: Socket | null;
    onlineUsers: {
        user_id: string;
        socket_id: string;
    }[];
    chats: ChatItf[] | null;
    aiChats: AIChatItf[] | null;
    currentChat: ChatItf | null;
    currentAIChat: AIChatItf | null;
    isOpeningChatInfo: boolean;
    availableTakers: TakerItf[];
    isChattingWithAI: boolean;
    aiModels: AIModelsItf[];
    selectedAIModel: string | null;
    isGeneratingResponse: boolean;

    setChattingWithAI: (isChattingWithAI: boolean) => void;
    setIsOpeningChatInfo: (isOpeningChatInfo: boolean) => void;
    setCurrentChat: (chat: ChatItf | null) => void;
    setCurrentAIChat: (chat: AIChatItf | null) => void;
    setChats: (chats: ChatItf[] | null) => void;
    setAIChats: (chats: AIChatItf[] | null) => void;
    updateChatInChats: (chatId: string, chatBody: Partial<ChatItf>) => void;
    sendMessage: (message: MessageItf) => void;
    removeMessage: (messageId: string) => void;
    emitTyping: (isTyping: boolean, chatId: string) => void;
    findSearchResult: () => void;
    cancelSearching: () => void;
    updateNickname: (
        chatId: string,
        memberId: string,
        nickname: string
    ) => void;
    setAvailableTakers: (availabelTakers: TakerItf[]) => void;
    setAIModels: (aiModels: AIModelsItf[]) => void;
    setSelectedAIModel: (aiModel: string | null) => void;
    setIsGeneratingResponse: (isGeneratingResponse: boolean) => void;
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

export interface MessageAIBody {
    text: string;
}
