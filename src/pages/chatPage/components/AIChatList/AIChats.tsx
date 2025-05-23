import React from "react";
import { useChatSocket } from "../ChatSocketContext";
import AIChatCard from "./AIChatCard";

const AIChats = () => {
    const { aiChats } = useChatSocket();

    return (
        <div className="space-y-2">
            {aiChats &&
                aiChats.length > 0 &&
                aiChats.map((chat) => (
                    <AIChatCard key={chat.id} aiChat={chat} />
                ))}
        </div>
    );
};

export default AIChats;
