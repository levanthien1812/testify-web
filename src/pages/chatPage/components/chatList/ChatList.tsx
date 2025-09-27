import React, { useState } from "react";
import Button from "../../../../components/elements/Button";
import Loading from "../../../../components/loadings/Loading";
import { useChatSocket } from "../ChatSocketContext";
import AddChat from "./AddChat";
import Chats from "./Chats";
import { useAppSelector } from "../../../../hooks/hooks";
import { ROLES } from "../../../../config/constants/tests";
import RequestChat from "./RequestChat";
import ChatTabs from "../selectedChat/ChatTabs";

const ChatList = ({ isLoadingChats }: { isLoadingChats: boolean }) => {
    const [isAddingChat, setIsAddingChat] = React.useState(false);
    const [isRequestingChat, setIsRequestingChat] = useState(false);
    const { user } = useAppSelector((state) => state.auth);

    const { chats, setChattingWithAI, isChattingWithAI } = useChatSocket();

    const handleClickChatWithAI = () => {
        setChattingWithAI(true);
    };

    const handleClickAddChat = () => {
        setIsAddingChat(true);
    };

    const handleClickRequestChat = () => {
        setIsRequestingChat(true);
    };

    if (!user) return null;

    return (
        <div className="p-2 bg-white shadow-md relative flex-[1] min-w-[30%]">
            <ChatTabs />
            <div className="flex justify-between py-2 border-b border-dashed border-gray-300">
                <h3 className="text-2xl font-bold">Messages</h3>
                {user.role === ROLES.MAKER && (
                    <Button size="sm" onClick={handleClickAddChat}>
                        Add chat
                    </Button>
                )}
                {user.role === ROLES.TAKER && (
                    <Button size="sm" onClick={handleClickRequestChat}>
                        Request chat
                    </Button>
                )}
            </div>
            <div className="mt-4 ">
                <Loading
                    isLoading={isLoadingChats}
                    loadingText={{ text: "Loading chats" }}
                />
                {chats && chats.length === 0 && !isLoadingChats && (
                    <p className="text-center text-gray-500 text-xl">
                        No chats yet
                    </p>
                )}

                {chats && chats.length > 0 && !isChattingWithAI && <Chats />}

                <div className="absolute bottom-3 left-3">
                    <Button
                        style={{
                            backgroundColor: "#4158D0",
                            backgroundImage:
                                "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
                        }}
                        onClick={handleClickChatWithAI}
                    >
                        Chat with AI
                    </Button>
                </div>
            </div>
            {isAddingChat && <AddChat onClose={() => setIsAddingChat(false)} />}
            {isRequestingChat && (
                <RequestChat onClose={() => setIsRequestingChat(false)} />
            )}
        </div>
    );
};

export default ChatList;
