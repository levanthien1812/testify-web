import React, { useEffect, useMemo } from "react";
import { ChatItf } from "../../../types/types";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import { useChatSocket } from "./ChatSocketContext";
import { format } from "date-fns";

const ChatCard = ({ chat }: { chat: ChatItf }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const { socket, onlineUsers, setCurrentChat, currentChat } =
        useChatSocket();

    useEffect(() => {}, []);

    return (
        <div
            key={chat.id}
            className={`flex items-center p-2 ${
                currentChat?.id === chat.id ? "bg-orange-100" : "bg-slate-100"
            } shadow-md gap-2 hover:bg-slate-200 cursor-pointer max-w-full`}
            onClick={() => setCurrentChat(chat)}
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
                                className={`w-10 h-10 shrink-0 rounded-full absolute shadow-md`}
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
                {chat.last_message && (
                    <div className="flex justify-between gap-2">
                        <p className="text-gray-500 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                            {chat.last_message?.sender_id === user?.id
                                ? "You"
                                : chat.members.find(
                                      (member) =>
                                          member.member.id ===
                                          chat.last_message?.sender_id
                                  )?.member.name}
                            {": "}
                            {chat.last_message?.text}
                        </p>
                        <p className="text-gray-500 text-sm shrink-0">
                            {format(chat.last_message?.created_at, "HH:mm:ss")}
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
