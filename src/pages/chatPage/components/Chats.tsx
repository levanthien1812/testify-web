import { ChatItf } from "../../../types/chat";
import ChatCard from "./ChatCard";
import { useChatSocket } from "./ChatSocketContext";

const Chats = () => {
    const { chats } = useChatSocket();

    return (
        <div className="space-y-2">
            {chats!.map((chat) => (
                <ChatCard chat={chat} />
            ))}
        </div>
    );
};

export default Chats;
