import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../../stores/rootState";
import { useChatSocket } from "../ChatSocketContext";
import ChatInfo from "../chatInfo/ChatInfo";
import Messages from "./Messages";
import InputMessage from "./InputMessage";

const SelectedChat = () => {
    const { currentChat: chat, onlineUsers } = useChatSocket();

    const [openInfo, setOpenInfo] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <>
            <div className="flex w-2/3 p-2 bg-white shadow-md">
                <div className="flex flex-col grow">
                    <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                        <div className="flex items-center gap-2">
                            <h3 className="text-2xl font-bold">
                                {chat!.chat_name}
                            </h3>
                            <FontAwesomeIcon
                                icon={faCircle}
                                className="text-gray-300 text-[4px]"
                            />
                            <p className="">
                                {chat &&
                                onlineUsers.find((onlineUser) =>
                                    chat.members
                                        .map((member) => member.member.id)
                                        .filter((id) => id !== user!.id)
                                        .includes(onlineUser.user_id)
                                )
                                    ? "Online"
                                    : "Offline"}
                            </p>
                        </div>
                        <button
                            className="flex items-center bg-gray-300 hover:bg-gray-400 p-2 leading-none rounded-full"
                            onClick={(e) => setOpenInfo(!openInfo)}
                        >
                            <FontAwesomeIcon
                                icon={
                                    !openInfo ? faChevronLeft : faChevronRight
                                }
                                className="w-3 h-3 text-gray-700"
                            />
                        </button>
                    </div>
                    <Messages />
                    <InputMessage />
                </div>
            </div>
            {openInfo && <ChatInfo />}
        </>
    );
};

export default SelectedChat;
