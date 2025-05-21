import React from "react";
import { AIChatItf } from "../../../../types/chat";
import { useChatSocket } from "../ChatSocketContext";

type AIChatCardProps = {
    aiChat: AIChatItf;
};

const AIChatCard = ({ aiChat }: AIChatCardProps) => {
    const { currentAIChat, setCurrentAIChat } = useChatSocket();

    const handleClickCard = () => {
        if (currentAIChat?.id === aiChat.id) return;
        setCurrentAIChat({
            ...aiChat,
        });
    };

    return (
        <div
            className={`flex items-center p-2 ${
                currentAIChat?.id === aiChat.id
                    ? "bg-orange-100"
                    : "bg-slate-100"
            } shadow-md gap-2 hover:bg-slate-200 cursor-pointer max-w-full`}
            onClick={handleClickCard}
        >
            <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                {aiChat.chat_name}
            </p>
        </div>
    );
};

export default AIChatCard;
