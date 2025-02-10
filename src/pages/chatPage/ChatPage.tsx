import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getChats } from "../../services/chat";
import Button from "../../components/elements/Button";
import AddChat from "./components/AddChat";
import { ChatItf } from "../../types/chat";
import Chats from "./components/Chats";
import SelectedChat from "./components/SelectedChat";
import ChatInfo from "./components/ChatInfo";
import { useChatSocket } from "./components/ChatSocketContext";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/rootState";

const ChatPage = () => {
    const [isAddingChat, setIsAddingChat] = React.useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const { socket, currentChat, setChats } = useChatSocket();
    const user = useSelector((state: RootState) => state.auth.user);

    const {
        data: chats,
        isLoading,
        error,
        refetch,
    } = useQuery<ChatItf[]>({
        queryFn: async () => {
            const responseData = await getChats();
            return responseData.chats;
        },
        queryKey: ["chats"],
        onSuccess: (data: ChatItf[]) => {
            setChats(data);
        },
    });

    useEffect(() => {
        if (!socket) return;
        socket.emit("add-online-users", user!.id);
    }, [socket]);

    return (
        <div className="mt-6 shadow-md w-5/6 h-[80vh] md:w-3/4 2xl:w-2/3 mx-auto flex p-2 bg-slate-50 gap-2">
            <div className="w-1/3 p-2 bg-white shadow-md grow-0">
                <div className="flex justify-between py-2 border-b border-dashed border-gray-300">
                    <h3 className="text-2xl font-bold">Messages</h3>
                    <Button size="sm" onClick={() => setIsAddingChat(true)}>
                        Add chat
                    </Button>
                </div>
                <div className="mt-4">
                    {isLoading && (
                        <p className="text-center text-gray-500 text-xl">
                            Loading chats...
                        </p>
                    )}
                    {chats && chats.length === 0 && (
                        <p className="text-center text-gray-500 text-xl">
                            No chats yet
                        </p>
                    )}
                    {chats && chats.length > 0 && <Chats />}
                </div>
            </div>

            {!currentChat && (
                <p className="text-center mt-8 text-gray-500 text-xl grow">
                    Select a chat to start chatting
                </p>
            )}
            {currentChat && (
                <SelectedChat openInfo={openInfo} setOpenInfo={setOpenInfo} />
            )}

            {openInfo && currentChat && <ChatInfo chat={currentChat} />}

            {isAddingChat && (
                <AddChat
                    onClose={() => setIsAddingChat(false)}
                    onAfterUpdate={refetch}
                />
            )}
        </div>
    );
};

export default ChatPage;
