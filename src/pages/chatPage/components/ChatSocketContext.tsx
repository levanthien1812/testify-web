import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "../../../stores/rootState";

interface ChatSocketContextItf {
    socket: Socket | null;
    onlineUsers: {
        user_id: string;
        socket_id: string;
    }[];
    currentChat: string | null;
}

const ChatSocketContext = React.createContext<ChatSocketContextItf | undefined>(
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
    const [currentChat, setCurrentChat] = React.useState<string | null>(null);

    useEffect(() => {
        const socket = io(process.env.REACT_APP_API_HOST!);
        setSocket(socket);

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on("connect", () => {
            console.log(socket.id);
        });

        socket.on("send-online-users", (users) => {
            console.log(users);
            setOnlineUsers(users);
        });
    }, [socket]);

    return (
        <ChatSocketContext.Provider
            value={{ socket, onlineUsers, currentChat }}
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
