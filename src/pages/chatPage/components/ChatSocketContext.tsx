import React, { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ChatContext, ChatItf, MessageItf } from "../../../types/chat";
import { SOCKET_EVENTS } from "../../../config/constants/socket";

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
            } else {
                const updatedChats = chats;
                const chatIndex = chats.findIndex(
                    (ch) => ch.id === message.chat_id
                );
                if (chatIndex < 0) return;
                updatedChats[chatIndex].last_message = message;
                if (updatedChats[chatIndex].unread_messages)
                    updatedChats[chatIndex].unread_messages!.push(message);

                setChats(chats);
            }
        });

        return () => {
            socket.off(SOCKET_EVENTS.SEND_ONLINE_USERS);
            socket.off(SOCKET_EVENTS.GET_MESSAGE);
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
