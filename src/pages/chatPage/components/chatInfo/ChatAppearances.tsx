import React from "react";
import {
    CHAT_BACKGROUND_COLORS,
    DEFAULT_APPEARANCES,
    MESSAGE_BACKGROUND_COLORS,
    MESSAGE_FONT_SIZES,
} from "../../../../config/constants/chat";
import { useChatSocket } from "../ChatSocketContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../../components/elements/Button";
import { useMutation } from "react-query";
import { updateChat } from "../../../../services/chat";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import { SOCKET_EVENTS } from "../../../../config/constants/socket";
import { ChatAppearancesItf } from "../../../../types/chat";

type ChatAppearancesProps = {
    onClose: () => void;
};

const ChatAppearances = ({ onClose }: ChatAppearancesProps) => {
    const { currentChat, setCurrentChat, socket } = useChatSocket();

    const { mutate: updateChatMutate, isLoading: isUpdatingChat } = useMutation(
        {
            mutationFn: async (appearances: Partial<ChatAppearancesItf>) => {
                const response = await updateChat(currentChat?.id!, {
                    appearances: appearances,
                });
                return response;
            },
            mutationKey: [MUTATION_KEYS.UPDATE_CHAT],
            onSuccess: (data) => {
                if (socket) {
                    socket.emit(SOCKET_EVENTS.CHANGE_APPREARANCES, {
                        message: data.message,
                        appearances: data.chat?.appearances,
                    });
                }
            },
        }
    );

    const handleChooseChatBgColor = (color: string) => {
        setCurrentChat({
            ...currentChat!,
            appearances: {
                ...currentChat!.appearances,
                background_color: color,
            },
        });
        updateChatMutate({
            background_color: color,
        });
    };

    const handleChooseMessageBgColor = (color: string) => {
        setCurrentChat({
            ...currentChat!,
            appearances: {
                ...currentChat!.appearances,
                messages_color: color,
            },
        });
        updateChatMutate({
            messages_color: color,
        });
    };

    const handleChooseMessageFontSize = (size: string) => {
        setCurrentChat({
            ...currentChat!,
            appearances: {
                ...currentChat!.appearances,
                messages_font_size: size,
            },
        });
        updateChatMutate({
            messages_font_size: size,
        });
    };

    const handleClickReset = () => {
        setCurrentChat({
            ...currentChat!,
            appearances: DEFAULT_APPEARANCES,
        });
        updateChatMutate(DEFAULT_APPEARANCES);
    };

    return (
        <div>
            <button
                className="text-gray-400 hover:text-gray-500 hover:underline flex items-center gap-1 text-sm"
                onClick={onClose}
            >
                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                Back
            </button>
            <p className="text-lg">Chat appearances</p>
            <div className="mt-2">
                <p>Chat background color</p>
                <ul className="flex gap-2 mt-1">
                    {Object.keys(CHAT_BACKGROUND_COLORS).map((key, index) => (
                        <li key={index}>
                            <button
                                className={`w-5 h-5 rounded-full border ${
                                    currentChat?.appearances
                                        .background_color === key
                                        ? "border-orange-500"
                                        : "border-gray-200"
                                } hover:border-gray-400`}
                                style={{
                                    backgroundColor:
                                        CHAT_BACKGROUND_COLORS[key].color_code,
                                }}
                                onClick={() => handleChooseChatBgColor(key)}
                            ></button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-2">
                <p>Message background color</p>
                <ul className="flex gap-2 mt-1">
                    {Object.keys(MESSAGE_BACKGROUND_COLORS).map(
                        (key, index) => (
                            <li key={index}>
                                <button
                                    className={`w-5 h-5 rounded-full border ${
                                        currentChat?.appearances
                                            .messages_color === key
                                            ? "border-orange-500"
                                            : "border-gray-200"
                                    } hover:border-gray-400`}
                                    style={{
                                        backgroundColor:
                                            MESSAGE_BACKGROUND_COLORS[key]
                                                .color_code,
                                    }}
                                    onClick={() =>
                                        handleChooseMessageBgColor(key)
                                    }
                                ></button>
                            </li>
                        )
                    )}
                </ul>
            </div>
            <div className="mt-2">
                <p>Message font size</p>
                <ul className="flex gap-2 mt-1">
                    {Object.keys(MESSAGE_FONT_SIZES).map((key, index) => (
                        <li key={index}>
                            <button
                                className={`bg-gray-100 rounded-md flex justify-center items-center p-2 h-full ${
                                    currentChat?.appearances
                                        .messages_font_size === key
                                        ? "border border-orange-500"
                                        : ""
                                } font-medium hover:bg-gray-200 flex-[1]`}
                                onClick={() => handleChooseMessageFontSize(key)}
                                style={{
                                    fontSize: MESSAGE_FONT_SIZES[key].font_size,
                                    lineHeight:
                                        MESSAGE_FONT_SIZES[key].line_height,
                                }}
                            >
                                {MESSAGE_FONT_SIZES[key].font_name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex gap-1 mt-2">
                <Button size="sm" onClick={handleClickReset}>
                    Reset
                </Button>
            </div>
        </div>
    );
};

export default ChatAppearances;
