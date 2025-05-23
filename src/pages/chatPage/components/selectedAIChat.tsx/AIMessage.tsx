import { AIChatMessageItf } from "../../../../types/chat";
import { MESSAGE_AI_ROLE } from "../../../../config/constants/chat";
import {
    faCopy,
    faPen,
    faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import IconButton from "../../../../components/elements/IconButton";
import { useState } from "react";
import { useChatSocket } from "../ChatSocketContext";

type AIMessageProps = {
    message: AIChatMessageItf;
};

const AIMessage = ({ message }: AIMessageProps) => {
    const { currentAIChat } = useChatSocket();
    const [isHover, setIsHover] = useState(false);

    const handleCLickRegenerateButton = () => {};

    const handleCLickCopyButton = () => {
        navigator.clipboard.writeText(message.content);
    };

    const handleCLickEditButton = () => {};

    return (
        <div
            className={`flex flex-col gap-1 ${
                message.role === MESSAGE_AI_ROLE.USER
                    ? "items-end"
                    : "items-start"
            }`}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            {message.role === MESSAGE_AI_ROLE.ASSISTANT && (
                <div className="gap-2 flex">
                    {currentAIChat?.last_assistant_message_id ===
                        message.id && (
                        <IconButton
                            icon={faRotateRight}
                            onClick={handleCLickRegenerateButton}
                        />
                    )}
                    {(isHover ||
                        currentAIChat?.last_assistant_message_id ===
                            message.id) && (
                        <IconButton
                            icon={faCopy}
                            onClick={handleCLickCopyButton}
                        />
                    )}
                </div>
            )}
            <div className="flex gap-2 max-w-[80%] items-center">
                {isHover &&
                    message.role === MESSAGE_AI_ROLE.USER &&
                    currentAIChat?.last_user_message_id === message.id && (
                        <div className="gap-2 flex">
                            <IconButton
                                icon={faPen}
                                onClick={handleCLickEditButton}
                            />
                        </div>
                    )}
                <div
                    className={` ${
                        message.role === MESSAGE_AI_ROLE.USER
                            ? "bg-orange-600 text-white border-none"
                            : "border border-orange-600 bg-white text-black hover:shadow-md hover:shadow-orange-200"
                    } rounded-xl text-md py-2 px-4 leading-tight focus:ring-2 focus:ring-orange-600 whitespace-pre-wrap`}
                >
                    {message.content}
                </div>
            </div>
        </div>
    );
};

export default AIMessage;
