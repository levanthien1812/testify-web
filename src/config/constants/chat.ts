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

export enum MESSAGE_TYPE {
    MESSAGE = "MESSAGE",
    NOTIFICATION = "NOTIFICATION",
}

export enum NOTIFICATION_TYPE {
    THEME_CHANGED = "THEME_CHANGED",
    NICK_NAME_CHANGED = "NICK_NAME_CHANGED",
    NICK_NAME_REMOVED = "NICK_NAME_REMOVED",
}

export const MESSAGES_PER_FETCH = 40;
