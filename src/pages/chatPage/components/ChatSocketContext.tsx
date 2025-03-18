import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ChatContext, ChatItf, MessageItf } from "../../../types/chat";
import { SOCKET_EVENTS } from "../../../config/constants/socket";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import { getNum } from "../../../utils/primitives";
import { getChatName } from "../../../utils/chat";
import {
    MESSAGE_TYPE,
    NOTIFICATION_TYPE,
} from "../../../config/constants/chat";
import { TakerItf } from "../../../types/types";

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
    const [isOpeningChatInfo, setIsOpeningChatInfo] = useState(false);
    const [availableTakers, setAvailableTakers] = useState<TakerItf[]>([]);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const socket = io(process.env.REACT_APP_API_HOST!);
        setSocket(socket);

        return () => {
            socket.disconnect();
        };
    }, []);

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

        socket.on(SOCKET_EVENTS.RECEIVE_REACTION, (data) => {
            if (!currentChat) return;
            const updatedMessages = currentChat.messages;
            const messageIndex = updatedMessages.findIndex(
                (message) => message.id === data.message_id
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

        socket.on(SOCKET_EVENTS.READ_MESSAGES, (data) => {});

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
        };
    }, [socket, currentChat, chats]);

    return (
        <ChatSocketContext.Provider
            value={{
                socket,
                onlineUsers,
                currentChat,
                chats,
                isOpeningChatInfo,
                availableTakers,
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
                        if (!isResultFound) {
                            setCurrentChat({
                                ...currentChat,
                                fetch_times:
                                    getNum(currentChat.fetch_times) + 1,
                            });
                        }
                    }
                },
                incrementFetchTimes() {
                    if (currentChat && currentChat.fetch_times) {
                        setCurrentChat({
                            ...currentChat,
                            is_accessed: true,
                            fetch_times: currentChat.fetch_times + 1,
                        });
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
