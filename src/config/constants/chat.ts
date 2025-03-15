import { ChatAppearancesItf } from "../../types/chat";

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
    APPEARANCES_CHANGED_BACKGROUND_COLOR = "BACKGROUND_COLOR_CHANGED",
    APPEARANCES_CHANGED_MESSAGES_COLOR = "MESSAGES_COLOR_CHANGED",
    APPEARANCES_CHANGED_MESSAGES_FONT_SIZE = "MESSAGES_FONT_SIZE_CHANGED",
    NICK_NAME_CHANGED = "NICK_NAME_CHANGED",
    NICK_NAME_REMOVED = "NICK_NAME_REMOVED",
}

export const CHAT_BACKGROUND_COLORS: {
    [key: string]: { color_code: string; color_name: string };
} = {
    lightBlue: {
        color_code: "#E0F7FA",
        color_name: "Light Blue",
    },
    lightGreen: {
        color_code: "#E8F5E9",
        color_name: "Light Green",
    },
    lightYellow: {
        color_code: "#FFFDE7",
        color_name: "Light Yellow",
    },
    lightRed: {
        color_code: "#FFE0E0",
        color_name: "Light Red",
    },
    lightPurple: {
        color_code: "#F3E5F5",
        color_name: "Light Purple",
    },
    lightGray: {
        color_code: "#F5F5F5",
        color_name: "Light Gray",
    },
};

export const MESSAGE_BACKGROUND_COLORS: {
    [key: string]: { color_code: string; color_name: string };
} = {
    blueGray: {
        color_code: "#90A4AE",
        color_name: "Blue Gray",
    },
    seaGreen: {
        color_code: "#808000",
        color_name: "Sea Green",
    },
    goldenRod: {
        color_code: "#DAA520",
        color_name: "Golden Rod",
    },
    salmon: {
        color_code: "#FA8072",
        color_name: "Salmon",
    },
    slateBlue: {
        color_code: "#6A5ACD",
        color_name: "Slate Blue",
    },
    dimGray: {
        color_code: "#696969",
        color_name: "Dim Gray",
    },
};

export const MESSAGE_FONT_SIZES: {
    [key: string]: {
        font_size: string;
        line_height: string;
        font_name: string;
    };
} = {
    small: {
        font_size: "0.875rem",
        line_height: "1.25rem",
        font_name: "Small",
    },
    medium: {
        font_size: "1rem",
        line_height: "1.5rem",
        font_name: "Medium",
    },
    large: {
        font_size: "1.125rem",
        line_height: "1.75rem",
        font_name: "Large",
    },
};

export const MESSAGES_PER_FETCH = 40;

export const DEFAULT_APPEARANCES: ChatAppearancesItf = {
    background_color: "lightBlue",
    messages_color: "blueGray",
    messages_font_size: "medium",
};
