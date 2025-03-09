import { useSelector } from "react-redux";
import { RootState } from "../../../../stores/rootState";
import { useChatSocket } from "../ChatSocketContext";
import { format } from "date-fns";
import { ChatItf } from "../../../../types/chat";
import { useCallback, useEffect, useMemo } from "react";

const ChatCard = ({ chat }: { chat: ChatItf }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const { onlineUsers, setCurrentChat, currentChat } = useChatSocket();

    const handleClickCard = () => {
        if (currentChat?.id === chat.id) return;
        setCurrentChat({
            ...chat,
            messages:
                chat.messages && chat.messages.length > 0 ? chat.messages : [],
            scroll_position: chat.scroll_position || 0,
            search_string: "",
        });
    };

    const getSender = useCallback(
        (sender_id: string) => {
            return chat!.members.find(
                (member) => member.member.id === sender_id
            );
        },
        [chat]
    );

    const typingSenderName = useMemo(() => {
        if (!chat || !chat.typing_info) return "";
        return (
            getSender(chat.typing_info.sender_id)?.nick_name ||
            getSender(chat.typing_info.sender_id)?.member.name
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chat?.typing_info?.sender_id, getSender]);

    const lastSenderName = useMemo(() => {
        if (!chat || !chat.last_message) return "";
        if (chat.last_message.sender_id === user?.id) return "You";
        return (
            getSender(chat.last_message.sender_id)?.nick_name ||
            getSender(chat.last_message.sender_id)?.member.name
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chat?.last_message?.sender_id, getSender]);

    // useEffect(() => {
    //     updateChatName(chat.id);
    // }, [updateChatName, chat.id]);

    return (
        <div
            key={chat.id}
            className={`flex items-center p-2 ${
                currentChat?.id === chat.id ? "bg-orange-100" : "bg-slate-100"
            } shadow-md gap-2 hover:bg-slate-200 cursor-pointer max-w-full`}
            onClick={handleClickCard}
        >
            <div className="flex relative h-10 w-1/5 shrink-0">
                {chat.members
                    .filter((member) => member.member.id !== user?.id)
                    .slice(0, 2)
                    .map((member, index) => {
                        return (
                            <img
                                key={member.member.id}
                                src={member.member.photo}
                                alt=""
                                className={`w-10 h-10 shrink-0 rounded-full object-cover absolute bg-white shadow-md`}
                                style={{
                                    left: `${index * 3 * 4}px`,
                                }}
                            />
                        );
                    })}
                {chat.members.length > 3 && (
                    <div
                        className={`w-10 h-10 shrink-0 rounded-full absolute shadow-md flex bg-white items-center justify-center text-gray-600 opacity-80 font-bold`}
                        style={{
                            left: `${(chat.members.length - 2 - 1) * 3 * 4}px`,
                        }}
                    >
                        +{chat.members.length - 3}
                    </div>
                )}
                {onlineUsers.find((onlineUser) =>
                    chat.members
                        .map((member) => member.member.id)
                        .filter((id) => id !== user!.id)
                        .includes(onlineUser.user_id)
                ) && (
                    <div className="absolute bg-green-600 w-3 h-3 rounded-full -bottom-0.5 -left-0.5 border border-white"></div>
                )}
            </div>
            <div className="grow min-w-0">
                <div className="flex gap-2 items-center">
                    <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                        {chat.chat_name}
                    </p>
                    {chat.unread_messages &&
                        chat.unread_messages.length > 0 && (
                            <div className="bg-orange-600 text-white w-4 h-4 flex justify-center items-center leading-none text-sm rounded-full">
                                {chat.unread_messages.length}
                            </div>
                        )}
                </div>
                {chat.last_message && !chat.typing_info?.is_typing && (
                    <div className="flex justify-between gap-2">
                        <p className="text-gray-500 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                            <span>
                                {lastSenderName}
                                {": "}
                            </span>

                            {!chat.last_message.deleted ? (
                                <>
                                    {chat.last_message.text.length > 0 && (
                                        <span> {chat.last_message?.text}</span>
                                    )}
                                    {chat.last_message.images &&
                                        chat.last_message.images.length > 0 && (
                                            <span>
                                                {`Sent ${chat.last_message.images.length} images`}
                                            </span>
                                        )}
                                </>
                            ) : (
                                <span className="italic">Message deleted</span>
                            )}
                        </p>
                        <p className="text-gray-500 text-sm shrink-0">
                            {format(chat.last_message?.created_at, "HH:mm:ss")}
                        </p>
                    </div>
                )}

                {chat.typing_info?.is_typing && (
                    <div>
                        <p className="text-gray-500 text-sm italic">
                            {typingSenderName} is typing...
                        </p>
                    </div>
                )}

                {!chat.last_message && (
                    <div className="text-gray-500 text-sm">No messages yet</div>
                )}
            </div>
        </div>
    );
};

export default ChatCard;
