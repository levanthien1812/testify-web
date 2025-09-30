import React, { useState } from "react";
import Button from "../../../../components/elements/Button";
import Loading from "../../../../components/loadings/Loading";
import { useChatSocket } from "../ChatSocketContext";
import AddChat from "./AddChat";
import Chats from "./Chats";
import { useAppSelector } from "../../../../hooks/hooks";
import { ROLES } from "../../../../config/constants/tests";
import RequestChat from "./RequestChat";
import { useQuery } from "react-query";
import { ChatItf } from "../../../../types/chat";
import { getChats } from "../../../../services/chat";
import { QUERY_KEYS } from "../../../../config/constants/queryMutationKeys";
import { getChatName } from "../../../../utils/chat";

const ChatList = () => {
    const [isAddingChat, setIsAddingChat] = React.useState(false);
    const [isRequestingChat, setIsRequestingChat] = useState(false);
    const { user } = useAppSelector((state) => state.auth);

    const { chats, isChattingWithAI, setChats } = useChatSocket();

    const { isLoading: isLoadingChats } = useQuery<ChatItf[]>({
        queryFn: async () => {
            const responseData = await getChats();
            return responseData.chats;
        },
        queryKey: [QUERY_KEYS.GET_CHATS],
        onSuccess: (data: ChatItf[]) => {
            if (chats && chats.length > 0) return;
            setChats(
                data.map((chat) => {
                    return {
                        ...chat,
                        scroll_position: 0,
                        unread_messages: [],
                        is_accessed: false,
                        chat_name: getChatName(chat.members, user!),
                    };
                })
            );
        },
    });

    const handleClickAddChat = () => {
        setIsAddingChat(true);
    };

    const handleClickRequestChat = () => {
        setIsRequestingChat(true);
    };

    if (!user) return null;

    return (
        <div>
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
            </div>
            {isAddingChat && <AddChat onClose={() => setIsAddingChat(false)} />}
            {isRequestingChat && (
                <RequestChat onClose={() => setIsRequestingChat(false)} />
            )}
        </div>
    );
};

export default ChatList;
