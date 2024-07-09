import React, { useEffect } from "react";
import { ChatItf, userItf } from "../../../types/types";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import { useChatSocket } from "./ChatSocketContext";

type ChatsProps = {
    chats: ChatItf[];
    setSelectedChat: React.Dispatch<React.SetStateAction<ChatItf | null>>;
};

const Chats = ({ chats, setSelectedChat }: ChatsProps) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const { socket, onlineUsers } = useChatSocket();

    return (
        <div className="space-y-2">
            {chats.map((chat) => {
                return (
                    <div
                        key={chat._id}
                        className="flex items-center p-2 bg-slate-100 shadow-md gap-2 hover:bg-slate-200 cursor-pointer max-w-full"
                        onClick={() => setSelectedChat(chat)}
                    >
                        <div className="flex relative h-10 w-1/5 shrink-0">
                            {chat.members
                                .filter(
                                    (member) => member.member.id !== user?.id
                                )
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
                                        left: `${
                                            (chat.members.length - 2 - 1) *
                                            3 *
                                            4
                                        }px`,
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
                            <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                                {chat.chat_name}
                            </p>
                            <div className="flex justify-between gap-2">
                                <p className="text-gray-500 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                                    {/* {chat.last_message?.message} */}A
                                    longggggggggggggggggggggggg last message
                                </p>
                                <p className="text-gray-500 text-sm shrink-0">
                                    {/* {chat.last_message?.time} */}
                                    18/12/2002
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Chats;
