import React from "react";
import ChatTabs from "../selectedChat/ChatTabs";
import Button from "../../../../components/elements/Button";
import { useChatSocket } from "../ChatSocketContext";
import ChatList from "./ChatList";
import { CHAT_TAB } from "../../../../config/constants/chat";
import ChatRequests from "./ChatRequests";
import ArchivedChats from "./ArchivedChats";

const ChatSidebar = () => {
    const { setChattingWithAI, currentTab } = useChatSocket();

    const handleClickChatWithAI = () => {
        setChattingWithAI(true);
    };

    return (
        <div className="p-2 bg-white shadow-md relative flex-[1] flex flex-col min-w-[30%] h-full">
            <ChatTabs />
            {currentTab === CHAT_TAB.CHATS && <ChatList />}
            {currentTab === CHAT_TAB.REQUESTS && <ChatRequests />}
            {currentTab === CHAT_TAB.ARCHIVED && <ArchivedChats />}
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
    );
};

export default ChatSidebar;
