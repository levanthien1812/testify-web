import { ChatItf } from "../../../types/types";
import ChatCard from "./ChatCard";

type ChatsProps = {
    chats: ChatItf[];
};

const Chats = ({ chats }: ChatsProps) => {

    return (
        <div className="space-y-2">
            {chats.map((chat) => (
                <ChatCard chat={chat} />
            ))}
        </div>
    );
};

export default Chats;
