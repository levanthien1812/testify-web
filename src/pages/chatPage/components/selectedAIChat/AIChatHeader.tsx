import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import IconButton from "../../../../components/elements/IconButton";
import { useChatSocket } from "../ChatSocketContext";

const AIChatHeader = () => {
    const { currentAIChat: chat, setCurrentAIChat } = useChatSocket();

    return (
        <div className="flex items-center gap-2 p-2 border-b border-dashed border-gray-300 bg-white bg-opacity-40">
            <IconButton
                icon={faChevronLeft}
                onClick={() => {
                    setCurrentAIChat(null);
                }}
            />
            <p className="text-xl">{chat?.chat_name}</p>
        </div>
    );
};

export default AIChatHeader;
