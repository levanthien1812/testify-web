import ChatCard from "./ChatCard";
import { useChatSocket } from "../ChatSocketContext";

const Chats = () => {
    const { chats } = useChatSocket();

    return (
        <div className="space-y-2">
            {chats!.map((chat) => (
                <ChatCard chat={chat} key={chat.id} />
            ))}
        </div>
    );
};

export default Chats;
