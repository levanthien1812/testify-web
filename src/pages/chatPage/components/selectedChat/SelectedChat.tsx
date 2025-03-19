import { useChatSocket } from "../ChatSocketContext";
import Messages from "./Messages";
import InputMessage from "./InputMessage";
import { CHAT_BACKGROUND_COLORS } from "../../../../config/constants/chat";
import ChatHeader from "./ChatHeader";
import InputBlocked from "./InputBlocked";

const SelectedChat = () => {
    const { currentChat: chat } = useChatSocket();

    return (
        <div
            className="flex shadow-md flex-[2]"
            style={{
                backgroundColor: chat?.appearances.background_color
                    ? CHAT_BACKGROUND_COLORS[chat?.appearances.background_color]
                          ?.color_code
                    : "bg-white",
            }}
        >
            <div className="flex flex-col grow">
                <ChatHeader />
                <Messages />
                {!chat?.is_chat_blocked ? <InputMessage /> : <InputBlocked />}
            </div>
        </div>
    );
};

export default SelectedChat;
