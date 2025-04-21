import { useEffect } from "react";
import { useQuery } from "react-query";
import { getChats } from "../../services/chat";
import { ChatItf } from "../../types/chat";
import SelectedChat from "./components/selectedChat/SelectedChat";
import { useChatSocket } from "./components/ChatSocketContext";
import { SOCKET_EVENTS } from "../../config/constants/socket";
import { useNavigate, useParams } from "react-router";
import { getChatName } from "../../utils/chat";
import ChatInfo from "./components/chatInfo/ChatInfo";
import { QUERY_KEYS } from "../../config/constants/queryMutationKeys";
import { userItf } from "../../types/types";
import { getBlockedInfo } from "../../services/user";
import { useDispatch } from "react-redux";
import { authActions } from "../../stores/auth";
import ChatList from "./components/chatList/ChatList";
import SelectedAIChat from "./components/selectedAIChat.tsx/SelectedAIChat";
import { useAppSelector } from "../../hooks/hooks";

const ChatPage = () => {
    const {
        socket,
        currentChat,
        currentAIChat,
        setChats,
        setCurrentChat,
        isOpeningChatInfo,
        setChattingWithAI,
        isChattingWithAI,
    } = useChatSocket();
    const user = useAppSelector((state) => state.auth.user);
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: chats, isLoading: isLoadingChats } = useQuery<ChatItf[]>({
        queryFn: async () => {
            const responseData = await getChats();
            return responseData.chats;
        },
        queryKey: [QUERY_KEYS.GET_CHATS],
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

    const { data: blockedInfo, isLoading: isLoadingBlockedInfo } = useQuery({
        queryFn: async () => {
            const responseData = await getBlockedInfo();
            return responseData;
        },
        queryKey: [QUERY_KEYS.GET_BLOCKED_USERS],
        onSuccess: (data) => {
            dispatch(
                authActions.setBlockedUsers(
                    data.blockedUsers.map(
                        (blockedUser: userItf) => blockedUser.id
                    )
                )
            );
            dispatch(
                authActions.setBlockedBy(
                    data.blockedBy.map((blockedBy: userItf) => blockedBy.id)
                )
            );
        },
    });

    const handleClickChatWithAI = () => {
        setChattingWithAI(true);
    };

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
        <div
            className={`mt-6 shadow-md w-5/6 h-[80vh] xl:w-3/4 2xl:w-2/3 mx-auto flex p-2 bg-slate-50 gap-2`}
        >
            <ChatList isLoadingChats={isLoadingChats} />
            {!currentChat && !currentAIChat && (
                <p className="text-center mt-8 text-gray-500 text-xl grow">
                    Select a chat to start chatting
                </p>
            )}
            {!!currentChat && <SelectedChat />}
            {!!currentAIChat && <SelectedAIChat />}

            {isOpeningChatInfo && <ChatInfo />}
        </div>
    );
};

export default ChatPage;
