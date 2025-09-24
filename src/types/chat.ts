import { Socket } from "socket.io-client";
import { MakerItf, TakerItf, UserItf } from "./types";
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
    member: UserItf;
    nick_name: string | null;
}

export interface ChatItf {
    id: string;
    members: MemberItf[];
    is_group_chat: boolean;
    group_admin: string | UserItf | null;
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
    reply_to?: string;
}

export interface AIChatItf {
    user_id: string;
    id?: string;
    chat_name: string;
    created_at: string;
    updated_at?: string;
    messages: AIChatMessageItf[];
    last_user_message_id?: string;
    last_assistant_message_id?: string;
    is_pinned?: boolean;
    is_archived?: boolean;
}

export interface AIChatBodyItf {
    first_message: string;
    model: string;
}

export type UpdateAIChat = Partial<
    Pick<AIChatItf, "is_pinned" | "is_archived" | "chat_name">
>;

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
    sender: Pick<UserItf, "name" | "photo">;
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
    chatsOpen: boolean;
    aiChatsOpen: boolean;
    isLoadingChats: boolean;
    availableMakers: MakerItf[];

    setChattingWithAI: (isChattingWithAI: boolean) => void;
    setIsOpeningChatInfo: (isOpeningChatInfo: boolean) => void;
    setCurrentChat: (chat: ChatItf | null) => void;
    setCurrentAIChat: React.Dispatch<React.SetStateAction<AIChatItf | null>>;
    setChats: (chats: ChatItf[] | null) => void;
    setAIChats: React.Dispatch<React.SetStateAction<AIChatItf[]>>;
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
    updateAIChat: (chatId: string, chatBody: Partial<AIChatItf>) => void;
    setPinnedAIChat: (chatId: string, isPinned: boolean) => void;
    setChatsOpen: (chatsOpen: boolean) => void;
    setAIChatsOpen: (aiChatsOpen: boolean) => void;
    setAvailableMakers: (makers: MakerItf[]) => void;
}

export interface Emoji {
    icon: string;
    code: string;
}

export interface ReactionEmoji {
    emoji: string;
    user_id: string;
    created_at: string;
    user?: Pick<UserItf, "id" | "name" | "photo">;
}

export interface MessageAIBody {
    text: string;
}
