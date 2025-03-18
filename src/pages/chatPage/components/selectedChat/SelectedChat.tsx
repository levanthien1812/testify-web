import { useChatSocket } from "../ChatSocketContext";
import Messages from "./Messages";
import InputMessage from "./InputMessage";
import { CHAT_BACKGROUND_COLORS } from "../../../../config/constants/chat";
import ChatHeader from "./ChatHeader";
import { useSelector } from "react-redux";
import { RootState } from "../../../../stores/rootState";
import { useMemo } from "react";
import InputBlocked from "./InputBlocked";

const SelectedChat = () => {
    const { currentChat: chat } = useChatSocket();
    const { user } = useSelector((state: RootState) => state.auth);

    const isUserBlocked = useMemo(() => {
        if (
            !chat ||
            !user ||
            !user.blocked_users ||
            user.blocked_users.length === 0
        )
            return false;

        const memberToCheck = chat?.members.filter(
            (member) => member.member.id !== user.id
        )[0];
        if (
            !chat.is_group_chat &&
            user.blocked_users.includes(memberToCheck?.member.id)
        ) {
            return true;
        }
        return false;
    }, [chat, user]);

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
                {!isUserBlocked ? <InputMessage /> : <InputBlocked />}
            </div>
        </div>
    );
};

export default SelectedChat;
