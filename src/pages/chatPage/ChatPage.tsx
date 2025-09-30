import { useEffect } from "react";
import { useQuery } from "react-query";
import SelectedChat from "./components/selectedChat/SelectedChat";
import { useChatSocket } from "./components/ChatSocketContext";
import { SOCKET_EVENTS } from "../../config/constants/socket";
import { useNavigate, useParams } from "react-router";
import ChatInfo from "./components/chatInfo/ChatInfo";
import { QUERY_KEYS } from "../../config/constants/queryMutationKeys";
import { UserItf } from "../../types/types";
import { getBlockedInfo } from "../../services/user";
import { useDispatch } from "react-redux";
import { authActions } from "../../stores/auth";
import SelectedAIChat from "./components/selectedAIChat/SelectedAIChat";
import { useAppSelector } from "../../hooks/hooks";
import { useSearchParams } from "react-router-dom";
import ChatSidebar from "./components/chatSidebar/ChatSidebar";
import AIChatSidebar from "./components/AIChatSidebar/AIChatSidebar";
import { CHAT_TAB } from "../../config/constants/chat";

const ChatPage = () => {
    const {
        socket,
        currentChat,
        currentAIChat,
        chats,
        setCurrentChat,
        isOpeningChatInfo,
        isChattingWithAI,
        setChatsOpen,
        setAIChatsOpen,
        setCurrentTab,
    } = useChatSocket();
    const user = useAppSelector((state) => state.auth.user);
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useQuery({
        queryFn: async () => {
            const responseData = await getBlockedInfo();
            return responseData;
        },
        queryKey: [QUERY_KEYS.GET_BLOCKED_USERS],
        onSuccess: (data) => {
            dispatch(
                authActions.setBlockedUsers(
                    data.blockedUsers.map(
                        (blockedUser: UserItf) => blockedUser.id
                    )
                )
            );
            dispatch(
                authActions.setBlockedBy(
                    data.blockedBy.map((blockedBy: UserItf) => blockedBy.id)
                )
            );
        },
    });

    useEffect(() => {
        if (!socket) return;
        socket.emit(SOCKET_EVENTS.ADD_ONLINE_USERS, user!.id);
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
            navigate("/chats");
        }
    }, [chats, navigate, params.chatId, setCurrentChat]);

    useEffect(() => {
        if (!isChattingWithAI) setChatsOpen(true);
        else setAIChatsOpen(true);
        return () => {
            setChatsOpen(false);
            setAIChatsOpen(false);
        };
    }, [isChattingWithAI, setChatsOpen, setAIChatsOpen]);

    useEffect(() => {
        if (searchParams.has("tab")) {
            const tab = searchParams.get("tab");
            if (tab === CHAT_TAB.CHATS) setCurrentTab(CHAT_TAB.CHATS);
            else if (tab === CHAT_TAB.REQUESTS)
                setCurrentTab(CHAT_TAB.REQUESTS);
            else if (tab === CHAT_TAB.ARCHIVED)
                setCurrentTab(CHAT_TAB.ARCHIVED);
        }
    }, [searchParams, setCurrentTab]);

    return (
        <div
            className={`md:mt-6 shadow-md w-full md:w-5/6 h-[80vh] xl:w-3/4 2xl:w-2/3 mx-auto flex p-2 bg-slate-50 gap-2 relative md:static`}
        >
            {!isChattingWithAI && <ChatSidebar />}
            {isChattingWithAI && <AIChatSidebar />}
            {((!currentChat && !isChattingWithAI) ||
                (!currentAIChat && isChattingWithAI)) && (
                <p className="text-center mt-8 text-gray-500 text-xl grow hidden md:block">
                    Select a chat to start chatting
                </p>
            )}
            {currentChat && !isChattingWithAI && <SelectedChat />}
            {currentAIChat && isChattingWithAI && <SelectedAIChat />}

            {isOpeningChatInfo && <ChatInfo />}
        </div>
    );
};

export default ChatPage;
