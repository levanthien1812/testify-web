import React from "react";
import { useChatSocket } from "../ChatSocketContext";
import AIChatHeader from "./AIChatHeader";
import AIMessages from "./AIMessages";
import AIInputMessage from "./AIInputMessage";

const SelectedAIChat = () => {
    const { currentAIChat: chat } = useChatSocket();

    return (
        <div className="flex shadow-md flex-[2] bg-white">
            <div className="flex flex-col grow">
                <AIChatHeader />
                <AIMessages />
                <AIInputMessage />
            </div>
        </div>
    );
};

export default SelectedAIChat;
