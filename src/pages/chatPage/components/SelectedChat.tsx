import { useEffect, useRef, useState } from "react";
import Input from "../../../components/elements/Input";
import Button from "../../../components/elements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faCircle,
    faDotCircle,
    faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery } from "react-query";
import {
    getMessages,
    sendMessage,
    updateReadMessagesByChatId,
} from "../../../services/chat";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import { format } from "date-fns";
import { useChatSocket } from "./ChatSocketContext";
import { ChatItf, MessageItf } from "../../../types/chat";
import {
    MUTATION_KEYS,
    QUERY_KEYS,
} from "../../../config/constants/queryMutationKeys";
import { SOCKET_EVENTS } from "../../../config/constants/socket";
import Loading from "../../../components/loadings/Loading";

type SelectedChatProps = {
    openInfo: boolean;
    setOpenInfo: (openInfo: boolean) => void;
};

const SelectedChat = ({ openInfo, setOpenInfo }: SelectedChatProps) => {
    const {
        socket,
        currentChat: chat,
        onlineUsers,
        setCurrentChat,
    } = useChatSocket();
    const [currentMessageText, setCurrentMessageText] = useState("");
    const user = useSelector((state: RootState) => state.auth.user);
    const [openEmoji, setOpenEmoji] = useState(false);
    const [messages, setMessages] = useState<MessageItf[]>([]);
    const [newMessage, setNewMessage] = useState<MessageItf | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { mutate: updateReadMessageMutate } = useMutation({
        mutationFn: async () => {
            const responseData = await updateReadMessagesByChatId(chat!.id, [
                user!.id,
            ]);

            return responseData.message;
        },
        mutationKey: [MUTATION_KEYS.UPDATE_MESSAGE, chat!.id],
        onSuccess: (data) => {
            setCurrentChat({ ...chat, unread_messages: [] } as ChatItf);
        },
    });

    const { isLoading: messagesLoading, refetch: refetchMessages } = useQuery<
        MessageItf[]
    >({
        queryKey: [QUERY_KEYS.GET_MESSAGES, chat!.id],
        queryFn: async () => {
            const responseData = await getMessages(chat!.id);
            return responseData.messages;
        },
        onSuccess: (data) => {
            setMessages(data);
            updateReadMessageMutate();
        },
    });

    const { mutate: sendMessageMutate } = useMutation({
        mutationFn: async () => {
            const responseData = await sendMessage({
                chat_id: chat!.id,
                text: currentMessageText,
            });

            return responseData.message;
        },
        mutationKey: [MUTATION_KEYS.SEND_MESSAGE, chat!.id],
        onSuccess: (data) => {
            setMessages((prev) => [...prev, data]);
            setNewMessage(data);
            setCurrentMessageText("");
        },
    });

    const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && currentMessageText.length > 0) {
            sendMessageMutate();
        }
    };

    useEffect(() => {
        if (newMessage && socket) {
            socket.emit(
                SOCKET_EVENTS.SEND_MESSAGE,
                newMessage,
                chat!.members
                    .map((member) => member.member.id)
                    .filter((id) => id !== user!.id)
            );
            setNewMessage(null);
        }

        return () => {
            socket?.off(SOCKET_EVENTS.SEND_MESSAGE);
        };
    }, [newMessage, socket, chat, user]);

    useEffect(() => {
        if (!socket) return;
        socket.on(SOCKET_EVENTS.GET_MESSAGE, (message: MessageItf) => {
            if (message.chat_id !== chat!.id) return;
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off(SOCKET_EVENTS.GET_MESSAGE);
        };
    }, [socket, chat]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="flex w-2/3 p-2 bg-white shadow-md">
            <div className="flex flex-col grow">
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                    <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold">
                            {chat!.chat_name}
                        </h3>
                        <FontAwesomeIcon
                            icon={faCircle}
                            className="text-gray-300 text-[4px]"
                        />
                        <p className="">
                            {chat &&
                            onlineUsers.find((onlineUser) =>
                                chat.members
                                    .map((member) => member.member.id)
                                    .filter((id) => id !== user!.id)
                                    .includes(onlineUser.user_id)
                            )
                                ? "Online"
                                : "Offline"}
                        </p>
                    </div>
                    <button
                        className="flex items-center bg-gray-300 hover:bg-gray-400 p-2 leading-none rounded-full"
                        onClick={(e) => setOpenInfo(!openInfo)}
                    >
                        <FontAwesomeIcon
                            icon={!openInfo ? faChevronRight : faChevronLeft}
                            className="w-3 h-3 text-gray-700"
                        />
                    </button>
                </div>
                <div
                    className="grow py-2 custom-scrollbar-y pe-1"
                    ref={scrollRef}
                >
                    {messagesLoading && (
                        <Loading
                            isLoading={messagesLoading}
                            loadingText={{ text: "Loading messages..." }}
                        />
                    )}
                    <div className="">
                        {messages &&
                            messages.map((message, index) => (
                                <div
                                    key={message.id}
                                    className={`flex flex-col mb-1 ${
                                        message.sender_id === user!.id
                                            ? "items-end"
                                            : "items-start"
                                    }`}
                                    ref={scrollRef}
                                >
                                    <div className="flex gap-1">
                                        {message.sender_id !== user!.id &&
                                            (messages[index + 1]?.sender_id !==
                                            message.sender_id ? (
                                                <div className="relative w-4 h-4 rounded-full shadow-md">
                                                    <img
                                                        className=""
                                                        src={
                                                            chat!.members.find(
                                                                (member) =>
                                                                    member
                                                                        .member
                                                                        .id ===
                                                                    message.sender_id
                                                            )?.member.photo
                                                        }
                                                        alt=""
                                                    />
                                                    <div className="absolute -right-0.5 -bottom-0.5 w-2 h-2 border border-white bg-green-500 rounded-full"></div>
                                                </div>
                                            ) : (
                                                <div className="w-4 h-4"></div>
                                            ))}
                                        <div>
                                            <div
                                                className={`text-white rounded-full py-0.5 px-4 ${
                                                    message.sender_id ===
                                                    user!.id
                                                        ? "text-end"
                                                        : "text-start"
                                                }`}
                                                style={{
                                                    backgroundColor:
                                                        chat!.appearances
                                                            .messages_color,
                                                }}
                                            >
                                                <p className="">
                                                    {message.text}
                                                </p>
                                            </div>
                                            {index === messages.length - 1 && (
                                                <p
                                                    className={`leading-none text-xs mt-1 ${
                                                        message.sender_id ===
                                                        user!.id
                                                            ? "text-end"
                                                            : "text-start"
                                                    } text-gray-500`}
                                                >
                                                    {format(
                                                        new Date(
                                                            message.created_at
                                                        ),
                                                        "HH:mm:ss"
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="flex border-t border-dashed border-gray-300 py-2 gap-2">
                    <Input
                        className="grow"
                        placeholder="Type a message"
                        value={currentMessageText}
                        onChange={(e) => setCurrentMessageText(e.target.value)}
                        onKeyDown={handlePressEnter}
                    />

                    <div className="relative flex justify-center">
                        <button
                            className=""
                            onClick={() => setOpenEmoji(!openEmoji)}
                        >
                            <FontAwesomeIcon
                                icon={faFaceSmile}
                                className="text-gray-500 hover:text-orange-600 text-2xl transition-all duration-150"
                            />
                        </button>
                        {openEmoji && (
                            <div className="absolute bottom-10">
                                <EmojiPicker
                                    onEmojiClick={(emojiObject) =>
                                        setCurrentMessageText(
                                            currentMessageText +
                                                emojiObject.emoji
                                        )
                                    }
                                />
                            </div>
                        )}
                    </div>

                    <Button onClick={() => sendMessageMutate()}>Send</Button>
                </div>
            </div>
        </div>
    );
};

export default SelectedChat;
