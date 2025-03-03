import React, { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ChatContext, ChatItf, MessageItf } from "../../../types/chat";
import { SOCKET_EVENTS } from "../../../config/constants/socket";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";

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
            if (updatedChats[chatIndex].unread_messages)
                updatedChats[chatIndex].unread_messages!.push(message);

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

        return () => {
            socket.off(SOCKET_EVENTS.SEND_ONLINE_USERS);
            socket.off(SOCKET_EVENTS.GET_MESSAGE);
            socket.off(SOCKET_EVENTS.DELETE_MESSAGE);
            socket.off(SOCKET_EVENTS.TYPING);
            socket.off(SOCKET_EVENTS.RECEIVE_REACTION);
        };
    }, [socket, currentChat, chats]);

    return (
        <ChatSocketContext.Provider
            value={{
                socket,
                onlineUsers,
                currentChat,
                chats,
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
