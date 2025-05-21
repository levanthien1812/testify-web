import React from "react";
import Button from "../../../../components/elements/Button";
import Loading from "../../../../components/loadings/Loading";
import { useChatSocket } from "../ChatSocketContext";
import AddChat from "./AddChat";
import Chats from "./Chats";
import AIChats from "../AIChatList/AIChats";
import { useAppSelector } from "../../../../hooks/hooks";
import { AIChatItf } from "../../../../types/chat";

const ChatList = ({ isLoadingChats }: { isLoadingChats: boolean }) => {
    const [isAddingChat, setIsAddingChat] = React.useState(false);
    const [isAddingAIChat, setIsAddingAIChat] = React.useState(false);
    const user = useAppSelector((state) => state.auth.user);

    const {
        chats,
        aiChats,
        setChattingWithAI,
        isChattingWithAI,
        setAIChats,
        setCurrentAIChat,
    } = useChatSocket();

    const handleClickChatWithAI = () => {
        setChattingWithAI(!isChattingWithAI);
    };

    const handleClickAddChat = () => {
        if (!isChattingWithAI) {
            setIsAddingChat(true);
        } else {
            setIsAddingAIChat(true);
            const newAIChat: AIChatItf = {
                chat_name: "New chat",
                created_at: new Date().toISOString(),
                user_id: user!.id,
                messages: [],
            };
            setAIChats([newAIChat]);
            setCurrentAIChat(newAIChat);
        }
    };

    return (
        <div className="p-2 bg-white shadow-md relative flex-[1] min-w-[30%]">
            <div className="flex justify-between py-2 border-b border-dashed border-gray-300">
                <h3 className="text-2xl font-bold">
                    {!isChattingWithAI ? "Messages" : "AI Chats"}
                </h3>
                <Button size="sm" onClick={handleClickAddChat}>
                    {!isChattingWithAI ? "Add chat" : "New chat"}
                </Button>
            </div>
            <div className="mt-4 ">
                {isLoadingChats && (
                    <Loading
                        isLoading={isLoadingChats}
                        loadingText={{ text: "Loading chats" }}
                    />
                )}
                {!isChattingWithAI && chats && chats.length === 0 && (
                    <p className="text-center text-gray-500 text-xl">
                        No chats yet
                    </p>
                )}
                {isChattingWithAI && aiChats && aiChats.length === 0 && (
                    <p className="text-center text-gray-500 text-xl">
                        No conversation created yet
                    </p>
                )}

                {chats && chats.length > 0 && !isChattingWithAI && <Chats />}
                {aiChats && aiChats.length > 0 && isChattingWithAI && (
                    <AIChats />
                )}

                <div className="absolute bottom-3 left-3">
                    <Button
                        style={{
                            backgroundColor: "#4158D0",
                            backgroundImage:
                                "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
                        }}
                        onClick={handleClickChatWithAI}
                    >
                        {!isChattingWithAI ? "Chat with AI" : "Back to chats"}
                    </Button>
                </div>
            </div>
            {isAddingChat && <AddChat onClose={() => setIsAddingChat(false)} />}
        </div>
    );
};

export default ChatList;
