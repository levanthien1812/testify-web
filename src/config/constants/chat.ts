import { Emoji } from "../../types/chat";

export enum CHAT_OPTIONS {
    INDIVIDUAL = "INDIVIDUAL",
    GROUP = "GROUP",
}

export const CLEAR_TYPING_INDICATOR_TIMEOUT = 700;

export const MESSAGE_EMOJIS: { [key: string]: { text: string; icon: string } } =
    {
        LIKE: {
            text: "Like",
            icon: "👍",
        },
        HEART: {
            text: "Heart",
            icon: "❤️",
        },
        LAUGH: {
            text: "Laugh",
            icon: "😂",
        },
        SAD: {
            text: "Sad",
            icon: "😢",
        },
        ANGRY: {
            text: "Angry",
            icon: "😡",
        },
        WOW: {
            text: "Wow",
            icon: "😮",
        },
    };

export const MESSAGES_PER_FETCH = 40;
