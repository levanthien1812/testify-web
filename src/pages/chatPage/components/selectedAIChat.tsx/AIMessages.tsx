import React from "react";
import { useChatSocket } from "../ChatSocketContext";
import AIMessage from "./AIMessage";

const AIMessages = () => {
    const { currentAIChat: chat, isGeneratingResponse } = useChatSocket();

    return (
        <div className="grow p-2 custom-scrollbar-y pe-1 space-y-2">
            {chat &&
                chat.messages &&
                chat.messages.length > 0 &&
                chat.messages.map((message) => (
                    <AIMessage message={message} key={message.id} />
                ))}
            {isGeneratingResponse && <p>Generating response ...</p>}
        </div>
    );
};

export default AIMessages;
