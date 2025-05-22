import React from "react";
import Button from "../../../../components/elements/Button";
import Loading from "../../../../components/loadings/Loading";
import { useChatSocket } from "../ChatSocketContext";
import AddChat from "./AddChat";
import Chats from "./Chats";

const ChatList = ({ isLoadingChats }: { isLoadingChats: boolean }) => {
    const [isAddingChat, setIsAddingChat] = React.useState(false);

    const { chats, setChattingWithAI, isChattingWithAI } = useChatSocket();

    const handleClickChatWithAI = () => {
        setChattingWithAI(true);
    };

    const handleClickAddChat = () => {
        setIsAddingChat(true);
    };

    return (
        <div className="p-2 bg-white shadow-md relative flex-[1] min-w-[30%]">
            <div className="flex justify-between py-2 border-b border-dashed border-gray-300">
                <h3 className="text-2xl font-bold">Messages</h3>
                <Button size="sm" onClick={handleClickAddChat}>
                    Add chat
                </Button>
            </div>
            <div className="mt-4 ">
                {isLoadingChats && (
                    <Loading
                        isLoading={isLoadingChats}
                        loadingText={{ text: "Loading chats" }}
                    />
                )}
                {chats && chats.length === 0 && (
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
        </div>
    );
};

export default ChatList;
