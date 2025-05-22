import { useChatSocket } from "../ChatSocketContext";

const AIChatHeader = () => {
    const { currentAIChat: chat } = useChatSocket();

    return (
        <div className="flex justify-between items-center p-2 border-b border-dashed border-gray-300 bg-white bg-opacity-40">
            <p className="text-xl">{chat?.chat_name}</p>
        </div>
    );
};

export default AIChatHeader;
