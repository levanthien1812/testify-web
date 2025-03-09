import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { getChats } from "../../services/chat";
import Button from "../../components/elements/Button";
import AddChat from "./components/chatList/AddChat";
import { ChatItf } from "../../types/chat";
import Chats from "./components/chatList/Chats";
import SelectedChat from "./components/selectedChat/SelectedChat";
import { useChatSocket } from "./components/ChatSocketContext";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/rootState";
import Loading from "../../components/loadings/Loading";
import { SOCKET_EVENTS } from "../../config/constants/socket";
import { useNavigate, useParams } from "react-router";
import { getChatName } from "../../utils/chat";

const ChatPage = () => {
    const [isAddingChat, setIsAddingChat] = React.useState(false);
    const { socket, currentChat, setChats, setCurrentChat } = useChatSocket();
    const user = useSelector((state: RootState) => state.auth.user);
    const params = useParams();
    const navigate = useNavigate();

    const {
        data: chats,
        isLoading,
        refetch,
    } = useQuery<ChatItf[]>({
        queryFn: async () => {
            const responseData = await getChats();
            return responseData.chats;
        },
        queryKey: ["chats"],
        onSuccess: (data: ChatItf[]) => {
            setChats(
                data.map((chat) => {
                    return {
                        ...chat,
                        scroll_position: 0,
                        unread_messages: [],
                        is_accessed: false,
                        fetch_times: 1,
                        chat_name: getChatName(chat.members, user!),
                    };
                })
            );
        },
    });

    useEffect(() => {
        if (!socket) return;
        socket.emit(SOCKET_EVENTS.ADD_ONLINE_USERS, user!.id);

        return () => {
            socket.emit(SOCKET_EVENTS.REMOVE_ONLINE_USERS, user!.id);
        };
    }, [socket, user]);

    useEffect(() => {
        if (!chats || chats.length === 0) return;
        if (params.chatId) {
            const chatIndex = chats.findIndex(
                (chat) => chat.id === params.chatId
            );
            setCurrentChat({
                ...chats[chatIndex],
                messages:
                    chats[chatIndex].messages &&
                    chats[chatIndex].messages.length > 0
                        ? chats[chatIndex].messages
                        : [],
            });
            navigate("/chat");
        }
    }, [chats, navigate, params.chatId, setCurrentChat]);

    return (
        <div className="mt-6 shadow-md w-5/6 h-[80vh] xl:w-3/4 2xl:w-2/3 mx-auto flex p-2 bg-slate-50 gap-2">
            <div className="w-1/3 p-2 bg-white shadow-md grow-0 relative">
                <div className="flex justify-between py-2 border-b border-dashed border-gray-300">
                    <h3 className="text-2xl font-bold">Messages</h3>
                    <Button size="sm" onClick={() => setIsAddingChat(true)}>
                        Add chat
                    </Button>
                </div>
                <div className="mt-4 ">
                    {isLoading && (
                        <Loading
                            isLoading={isLoading}
                            loadingText={{ text: "Loading chats" }}
                        />
                    )}
                    {chats && chats.length === 0 && (
                        <p className="text-center text-gray-500 text-xl">
                            No chats yet
                        </p>
                    )}
                    {chats && chats.length > 0 && <Chats />}
                    <div className="absolute bottom-3 left-3">
                        <Button
                            style={{
                                backgroundColor: "#4158D0",
                                backgroundImage:
                                    "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
                            }}
                        >
                            Chat with AI
                        </Button>
                    </div>
                </div>
            </div>

            {!currentChat && (
                <p className="text-center mt-8 text-gray-500 text-xl grow">
                    Select a chat to start chatting
                </p>
            )}
            {!!currentChat && <SelectedChat />}

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
