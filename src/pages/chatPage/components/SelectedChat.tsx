import { useState } from "react";
import { ChatItf, MessageItf } from "../../../types/types";
import Input from "../../../components/elements/Input";
import Button from "../../../components/elements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faFaceSmile,
    faFaceSmileBeam,
} from "@fortawesome/free-solid-svg-icons";
import ChatInfo from "./ChatInfo";
import { useMutation, useQuery } from "react-query";
import { getMessages, sendMessage } from "../../../services/chat";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import { format } from "date-fns";

type SelectedChatProps = {
    chat: ChatItf;
    openInfo: boolean;
    setOpenInfo: (openInfo: boolean) => void;
};

const SelectedChat = ({ chat, openInfo, setOpenInfo }: SelectedChatProps) => {
    const [currentMessageText, setCurrentMessageText] = useState("");
    const user = useSelector((state: RootState) => state.auth.user);
    const [openEmoji, setOpenEmoji] = useState(false);

    const {
        data: messages,
        isLoading: messagesLoading,
        refetch,
    } = useQuery<MessageItf[]>({
        queryKey: ["messages", chat._id],
        queryFn: async () => {
            const responseData = await getMessages(chat._id);

            return responseData.messages;
        },
    });

    const { mutate: sendMessageMutate } = useMutation({
        mutationFn: async () => {
            const responseData = await sendMessage({
                chat_id: chat._id,
                text: currentMessageText,
            });

            return responseData.message;
        },
        mutationKey: ["messages", chat._id],
        onSuccess: (data) => {
            refetch();
            setCurrentMessageText("");
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        },
    });

    return (
        <div className="flex w-2/3 p-2 bg-white shadow-md">
            <div className="flex flex-col h-full grow">
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                    <h3 className="text-2xl font-bold">{chat.chat_name}</h3>
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
                <div className="grow py-2">
                    {messages &&
                        messages.map((message, index) => (
                            <div
                                key={message._id}
                                className={`flex flex-col mb-1 ${
                                    message.sender_id === user!.id
                                        ? "items-end"
                                        : "items-start"
                                }`}
                            >
                                <div
                                    className={`text-white rounded-full py-0.5 px-4 ${
                                        message.sender_id === user!.id
                                            ? "text-end"
                                            : "text-start"
                                    }`}
                                    style={{
                                        backgroundColor:
                                            chat.appearances.messages_color,
                                    }}
                                >
                                    <p className="">{message.text}</p>
                                </div>
                                {index === messages.length - 1 && (
                                    <p className="leading-none text-xs mt-1">
                                        {format(
                                            new Date(message.created_at),
                                            "HH:mm:ss"
                                        )}
                                    </p>
                                )}
                            </div>
                        ))}
                </div>
                <div className="flex border-t border-dashed border-gray-300 py-2 gap-2">
                    <Input
                        className="grow"
                        placeholder="Type a message"
                        value={currentMessageText}
                        onChange={(e) => setCurrentMessageText(e.target.value)}
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
