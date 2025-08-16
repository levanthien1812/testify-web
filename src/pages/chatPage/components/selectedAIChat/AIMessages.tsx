import { useEffect, useRef } from "react";
import { useChatSocket } from "../ChatSocketContext";
import AIMessage from "./AIMessage";

const AIMessages = () => {
    const { currentAIChat: chat, isGeneratingResponse } = useChatSocket();
    const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
        }
    });

    return (
        <div
            className="grow p-2 custom-scrollbar-y pe-1 space-y-2"
            ref={messagesContainerRef}
        >
            {(!chat || !chat.messages || chat.messages.length === 0) && (
                <p className="my-8 text-center text-gray-400 text-xl">
                    Feel free to ask me anything!
                </p>
            )}
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
