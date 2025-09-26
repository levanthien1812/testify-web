import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
    AIChatItf,
    AIModelsItf,
    ChatContext,
    ChatItf,
    MessageItf,
} from "../../../types/chat";
import {
    NOTI_TOAST_CONFIG,
    SOCKET_EVENTS,
} from "../../../config/constants/socket";
import { getNum } from "../../../utils/primitives";
import { getChatName } from "../../../utils/chat";
import { MakerItf, TakerItf } from "../../../types/types";
import { useDispatch } from "react-redux";
import { authActions } from "../../../stores/auth";
import { useAppSelector } from "../../../hooks/hooks";
import { MESSAGE_AI_ROLE, MESSAGE_TYPE } from "../../../config/constants/chat";
import { toast } from "react-toastify";
import MessageNoti from "../../../components/notifications/MessageNoti";
import { useQuery } from "react-query";
import { getChats, getModelsAI } from "../../../services/chat";
import { QUERY_KEYS } from "../../../config/constants/queryMutationKeys";
import ReactionNoti from "../../../components/notifications/ReactionNoti";
import { NotificationItf, SendReaction } from "../../../types/socket";

const ChatSocketContext = React.createContext<ChatContext | undefined>(
    undefined
);

const ChatSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = React.useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = React.useState<
        {
            user_id: string;
            socket_id: string;
        }[]
    >([]);
    const [currentChat, setCurrentChat] = React.useState<ChatItf | null>(null);
    const [chats, setChats] = React.useState<ChatItf[] | null>([]);
    const [AIChats, setAIChats] = useState<AIChatItf[]>([]);
    const [isOpeningChatInfo, setIsOpeningChatInfo] = useState(false);
    const [availableTakers, setAvailableTakers] = useState<TakerItf[]>([]);
    const [isChattingWithAI, setIsChattingWithAI] = useState(false);
    const [currentAIChat, setCurrentAIChat] = React.useState<AIChatItf | null>(
        null
    );
    const [AIModels, setAIModels] = useState<AIModelsItf[]>([]);
    const [selectedAIModel, setSelectedAIModel] = useState<string | null>(null);
    const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
    const [chatsOpen, setChatsOpen] = useState(false);
    const [aiChatsOpen, setAIChatsOpen] = useState(false);
    const [availableMakers, setAvailableMakers] = useState<MakerItf[]>([]);
    const [notifications, setNotifications] = useState<NotificationItf[]>([]);

    const { user, isAuthened } = useAppSelector((state) => state.auth);
    const dispatch = useDispatch();

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
        enabled: isAuthened && !isChattingWithAI,
    });

    const { isLoading: isLoadingModels } = useQuery<AIModelsItf[]>({
        queryKey: [QUERY_KEYS.GET_AI_MODELS],
        queryFn: async () => {
            const responseData = await getModelsAI();
            return responseData.models;
        },
        onSuccess: (data: any) => {
            if (data.length === 0) return;
            setAIModels(data);
            setSelectedAIModel(data[0].id);
        },
        enabled: isAuthened && AIModels.length === 0,
    });

    useEffect(() => {
        const socket = io(
            `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`!
        );
        setSocket(socket);

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!chats || chats.length === 0 || !user) return;
        const updatedChats = chats.map((chat) => {
            let isChatBlocked = false;

            const otherMember = chat.members.find(
                (member) => member.member.id !== user?.id
            );
            const userMember = chat.members.find(
                (member) => member.member.id === user?.id
            );
            let memberToBlock = userMember,
                memberToBeBlocked = otherMember;

            if (
                user.blocked_users &&
                user.blocked_users.includes(otherMember!.member.id)
            ) {
                isChatBlocked = true;
                memberToBeBlocked = otherMember;
                memberToBlock = userMember;
            }
            if (
                user.blocked_by &&
                user.blocked_by.includes(otherMember!.member.id)
            ) {
                isChatBlocked = true;
                memberToBeBlocked = userMember;
                memberToBlock = otherMember;
            }
            return {
                ...chat,
                is_chat_blocked: isChatBlocked,
                member_to_be_blocked: memberToBeBlocked,
                member_to_block: memberToBlock,
            };
        });

        setChats(updatedChats);
    }, [chats?.length, user]);

    useEffect(() => {
        if (!currentAIChat || currentAIChat.messages.length === 0) return;
        let lastUserMessageId, lastAssistantMessageId;

        const lastMessage =
            currentAIChat.messages[currentAIChat.messages.length - 1];
        const penultimateMessage =
            currentAIChat.messages.length > 1
                ? currentAIChat.messages[currentAIChat.messages.length - 2]
                : null;

        if (lastMessage.role === MESSAGE_AI_ROLE.USER) {
            lastUserMessageId = lastMessage.id;
            lastAssistantMessageId = penultimateMessage?.id;
        } else {
            lastUserMessageId = penultimateMessage?.id;
            lastAssistantMessageId = lastMessage.id;
        }

        setCurrentAIChat({
            ...currentAIChat,
            last_user_message_id: lastUserMessageId,
            last_assistant_message_id: lastAssistantMessageId,
        });
    }, [currentAIChat?.messages]);

    useEffect(() => {
        if (!socket) return;
        socket.on(SOCKET_EVENTS.CONNECT, () => {
            console.log(`Socket ${socket.id} connected`);
        });

        socket.on(SOCKET_EVENTS.SEND_ONLINE_USERS, (users) => {
            setOnlineUsers(users);
        });

        socket.on(SOCKET_EVENTS.GET_MESSAGE, (message: MessageItf) => {
            if (!chats) return;
            if (
                (!chatsOpen ||
                    !currentChat ||
                    currentChat.id !== message.chat_id) &&
                user &&
                user.id !== message.sender_id &&
                message.type === MESSAGE_TYPE.MESSAGE
            ) {
                toast(
                    <MessageNoti
                        message={message.text}
                        sender={message.sender}
                    />,
                    NOTI_TOAST_CONFIG
                );
            }
            if (currentChat && message.chat_id === currentChat!.id) {
                setCurrentChat(
                    (prev) =>
                        ({
                            ...prev,
                            messages: [...currentChat.messages, message],
                        } as ChatItf)
                );
            }
            const updatedChats = JSON.parse(JSON.stringify(chats));
            const chatIndex = chats.findIndex(
                (ch) => ch.id === message.chat_id
            );
            if (chatIndex < 0) return;
            updatedChats[chatIndex].last_message = message;
            if (
                updatedChats[chatIndex].unread_messages &&
                currentChat?.id !== message.chat_id
            ) {
                updatedChats[chatIndex].unread_messages!.push(message);
            } else {
                updatedChats[chatIndex].unread_messages = [];
            }

            setChats(updatedChats);
        });

        socket.on(SOCKET_EVENTS.DELETE_MESSAGE, (message: MessageItf) => {
            if (!chats) return;
            if (currentChat && message.chat_id === currentChat!.id) {
                const updatedMessages = currentChat.messages;
                const messageIndex = currentChat.messages.findIndex(
                    (msg) => msg.id === message.id
                );
                if (messageIndex < 0) return;
                updatedMessages[messageIndex].deleted = true;
                setCurrentChat(
                    (prev) =>
                        ({
                            ...prev,
                            messages: updatedMessages,
                        } as ChatItf)
                );
            }
            const updatedChats = JSON.parse(JSON.stringify(chats));
            const chatIndex = chats.findIndex(
                (ch) => ch.id === message.chat_id
            );
            if (chatIndex < 0) return;
            if (updatedChats[chatIndex].last_message!.id === message.id) {
                updatedChats[chatIndex].last_message!.deleted = true;
            }

            setChats(updatedChats);
        });

        socket.on(SOCKET_EVENTS.TYPING, (data) => {
            if (!currentChat || !chats) return;
            if (currentChat.id === data.chat_id) {
                setCurrentChat({
                    ...currentChat,
                    typing_info: {
                        sender_id: data.sender_id,
                        is_typing: data.is_typing,
                    },
                } as ChatItf);
            }
            const updatedChats = JSON.parse(JSON.stringify(chats));
            const chatIndex = chats.findIndex((ch) => ch.id === data.chat_id);
            if (chatIndex < 0) return;
            updatedChats[chatIndex].typing_info = {
                sender_id: data.sender_id,
                is_typing: data.is_typing,
            };

            setChats(updatedChats);
        });

        socket.on(SOCKET_EVENTS.RECEIVE_REACTION, (data: SendReaction) => {
            if (
                (!chatsOpen ||
                    !currentChat ||
                    currentChat.id !== data.chat_id) &&
                user &&
                data.new_reaction.user &&
                user.id === data.message.sender_id &&
                user.id !== data.new_reaction.user.id &&
                data.type !== "remove"
            ) {
                toast(
                    <ReactionNoti
                        emoji={data.new_reaction.emoji}
                        message={data.message.text}
                        sender={data.new_reaction.user}
                        type={data.type}
                    />,
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: true,
                        style: {
                            fontFamily: "'EB Garamond', serif",
                        },
                    }
                );
            }
            if (!currentChat) return;

            const updatedMessages = currentChat.messages;
            const messageIndex = updatedMessages.findIndex(
                (message) => message.id === data.message.id
            );
            if (messageIndex < 0) return;
            updatedMessages[messageIndex].reactions = data.reactions;

            if (currentChat.id === data.chat_id) {
                setCurrentChat({
                    ...currentChat,
                    messages: updatedMessages,
                } as ChatItf);
            }
        });

        socket.on(SOCKET_EVENTS.RECEIVE_CHANGE_NICKNAME, (data) => {
            if (!currentChat || currentChat.id !== data.chat_id) return;

            const updatedMembers = currentChat!.members.map((member) => {
                if (member.member.id === data.member_id)
                    return { ...member, nick_name: data.nickname };
                return member;
            });

            setCurrentChat({
                ...currentChat!,
                members: updatedMembers,
            } as ChatItf);
        });

        socket.on(SOCKET_EVENTS.RECEIVE_CHANGE_APPREARANCES, (data) => {
            if (!currentChat || currentChat.id !== data.chat_id) return;
            setCurrentChat({
                ...currentChat,
                appearances: {
                    ...currentChat.appearances,
                    ...data.appearances,
                },
            } as ChatItf);
        });

        socket.on(SOCKET_EVENTS.RECEIVE_ADD_CHAT, (data) => {
            if (!chats) return;
            setChats([...chats, data.chat]);
        });

        socket.on(SOCKET_EVENTS.RECEIVE_BLOCK_USER, (data) => {
            if (!currentChat) return;
            if (data.blocked_user_id !== user?.id) return;

            dispatch(authActions.beBlockedByUser({ userId: data.user_id }));
        });

        socket.on(SOCKET_EVENTS.RECEIVE_UNBLOCK_USER, (data) => {
            if (!currentChat) return;
            if (data.blocked_user_id !== user?.id) return;

            dispatch(authActions.beUnblockedByUser({ userId: data.user_id }));
        });

        socket.on(SOCKET_EVENTS.READ_MESSAGES, (data) => {
            if (!chats) return;
        });

        socket.on(SOCKET_EVENTS.RECEIVE_REQUEST_CHAT, (data) => {
            toast(data.message, NOTI_TOAST_CONFIG);
            setNotifications((prev) => [data, ...prev]);
            console.log(data);
        });

        return () => {
            socket.off(SOCKET_EVENTS.SEND_ONLINE_USERS);
            socket.off(SOCKET_EVENTS.GET_MESSAGE);
            socket.off(SOCKET_EVENTS.DELETE_MESSAGE);
            socket.off(SOCKET_EVENTS.TYPING);
            socket.off(SOCKET_EVENTS.RECEIVE_REACTION);
            socket.off(SOCKET_EVENTS.RECEIVE_CHANGE_NICKNAME);
            socket.off(SOCKET_EVENTS.RECEIVE_CHANGE_APPREARANCES);
            socket.off(SOCKET_EVENTS.READ_MESSAGES);
            socket.off(SOCKET_EVENTS.RECEIVE_ADD_CHAT);
            socket.off(SOCKET_EVENTS.RECEIVE_BLOCK_USER);
            socket.off(SOCKET_EVENTS.RECEIVE_UNBLOCK_USER);
            socket.off(SOCKET_EVENTS.RECEIVE_REQUEST_CHAT);
        };
    }, [socket, currentChat, chats]);

    useEffect(() => {
        if (!socket || !user) return;
        return () => {
            socket.emit(SOCKET_EVENTS.REMOVE_ONLINE_USERS, user.id);
        };
    }, [socket, user]);

    return (
        <ChatSocketContext.Provider
            value={{
                socket,
                onlineUsers,
                currentChat,
                chats,
                aiChats: AIChats,
                isOpeningChatInfo,
                availableTakers,
                isChattingWithAI,
                currentAIChat,
                aiModels: AIModels,
                selectedAIModel,
                isGeneratingResponse,
                chatsOpen,
                aiChatsOpen,
                isLoadingChats,
                availableMakers,
                notifications,

                setAvailableTakers: (data) => {
                    setAvailableTakers(data);
                },
                setIsOpeningChatInfo: (isOpeningChatInfo) => {
                    setIsOpeningChatInfo(isOpeningChatInfo);
                },
                setCurrentChat: (chat: ChatItf | null) => {
                    setCurrentChat(chat);
                },
                setChats: (chats: ChatItf[] | null) => {
                    setChats(chats);
                },
                updateChatInChats: (
                    chatId: string,
                    chatBody: Partial<ChatItf>
                ) => {
                    if (!chats) return;
                    const newChats = chats.map((chat) => {
                        if (chat.id === chatId) {
                            return {
                                ...chat,
                                ...chatBody,
                            };
                        }
                        return chat;
                    });
                    setChats(newChats);
                },
                sendMessage: (message: MessageItf) => {
                    if (!socket) return;
                    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, message);
                },
                removeMessage: (messageId: string) => {
                    setCurrentChat(
                        (prev) =>
                            ({
                                ...prev,
                                messages: prev!.messages.filter(
                                    (msg) => msg.id !== messageId
                                ),
                            } as ChatItf)
                    );
                },
                emitTyping: (isTyping: boolean, chatId: string) => {
                    if (!socket) return;
                    socket.emit(SOCKET_EVENTS.TYPING, {
                        is_typing: isTyping,
                        chat_id: chatId,
                        sender_id: user?.id,
                    });
                },
                findSearchResult() {
                    if (
                        !currentChat ||
                        !currentChat.search_index ||
                        !currentChat.search_string ||
                        currentChat.search_string.trim().length <= 1
                    )
                        return;
                    const mappedMessages = currentChat.messages.map((msg) =>
                        msg.text.toLowerCase()
                    );

                    const totalResult = mappedMessages.filter((msg) =>
                        msg.includes(currentChat.search_string!)
                    ).length;

                    let isResultFound = false;

                    if (currentChat.search_string.length >= 2) {
                        for (let i = currentChat.search_index; i >= 0; i--) {
                            if (
                                mappedMessages[i] &&
                                mappedMessages[i].includes(
                                    currentChat.search_string.toLowerCase()
                                )
                            ) {
                                isResultFound = true;
                                setCurrentChat({
                                    ...currentChat,
                                    ...(currentChat.search_index <
                                    currentChat.messages.length - 1
                                        ? {
                                              prev_search_message_id:
                                                  currentChat.messages[
                                                      currentChat.search_index +
                                                          1
                                                  ].id,
                                          }
                                        : {}),
                                    curr_search_message_id:
                                        currentChat.messages[i].id,
                                    search_index: i - 1,
                                    search_result_no:
                                        getNum(currentChat.search_result_no) +
                                        1,
                                    search_result_total: totalResult,
                                });
                                break;
                            }
                        }
                    }
                },
                cancelSearching() {
                    if (currentChat) {
                        setCurrentChat({
                            ...currentChat,
                            search_index: currentChat.messages.length - 1,
                            search_result_no: 0,
                            search_result_total: 0,
                            search_string: "",
                        });
                    }
                },
                updateNickname(chatId, memberId, nickname) {
                    if (!currentChat || !chats) return;

                    const updatedMembers = currentChat.members.map((member) => {
                        if (member.member.id === memberId)
                            return { ...member, nick_name: nickname };
                        return member;
                    });

                    const updatedChatname = getChatName(updatedMembers, user!);

                    setCurrentChat({
                        ...currentChat,
                        members: updatedMembers,
                        chat_name: updatedChatname,
                    });

                    const updatedChats = chats.map((chat) => {
                        if (chat.id === chatId)
                            return {
                                ...chat,
                                members: updatedMembers,
                                chat_name: updatedChatname,
                            };
                        return chat;
                    });
                    setChats(updatedChats);
                },
                setChattingWithAI(isChattingWithAI) {
                    setIsChattingWithAI(isChattingWithAI);
                },
                setAIChats(AIChats) {
                    setAIChats(AIChats || []);
                },
                setCurrentAIChat,
                setAIModels(AIModels) {
                    setAIModels(AIModels);
                    if (AIModels.length > 0) {
                        setSelectedAIModel(AIModels[0].id);
                    }
                },
                setSelectedAIModel(AIModel) {
                    setSelectedAIModel(AIModel);
                },
                setIsGeneratingResponse: setIsGeneratingResponse,
                updateAIChat(chatId, chatBody) {
                    if (!AIChats) return;
                    const newAIChats = AIChats.map((chat) => {
                        if (chat.id === chatId) {
                            return {
                                ...chat,
                                ...chatBody,
                            };
                        }
                        return chat;
                    });
                    setAIChats(newAIChats);
                },
                setPinnedAIChat(chatId, isPinned) {
                    if (!chats) return;
                    const currentChat = AIChats.find(
                        (chat) => chat.id === chatId
                    );
                    if (!currentChat) return;

                    if (isPinned) {
                        const otherChats = AIChats.filter(
                            (chat) => chat.id !== chatId
                        );
                        currentChat.is_pinned = isPinned;
                        setAIChats([currentChat, ...otherChats]);
                    } else {
                        let pinnedChats = AIChats.filter(
                            (chat) => chat.is_pinned
                        );

                        let unpinnedChats = AIChats.filter(
                            (chat) => !chat.is_pinned
                        );

                        pinnedChats = pinnedChats.filter(
                            (chat) => chat.id !== chatId
                        );

                        const chatAfterIndex = unpinnedChats.findIndex(
                            (chat) => chat.updated_at! > currentChat.updated_at!
                        );

                        if (chatAfterIndex >= 0) {
                            if (chatAfterIndex < 0) return;
                            unpinnedChats.splice(
                                chatAfterIndex,
                                0,
                                currentChat
                            );
                        } else {
                            unpinnedChats.push(currentChat);
                        }

                        currentChat.is_pinned = isPinned;
                        setAIChats([...pinnedChats, ...unpinnedChats]);
                    }
                },
                setChatsOpen,
                setAIChatsOpen,
                setAvailableMakers,
                setNotifications,
            }}
        >
            {children}
        </ChatSocketContext.Provider>
    );
};

export const useChatSocket = () => {
    const context = React.useContext(ChatSocketContext);

    if (!context) {
        throw new Error(
            "useChatSocket must be used within a ChatSocketProvider"
        );
    }

    return context;
};

export default ChatSocketProvider;
