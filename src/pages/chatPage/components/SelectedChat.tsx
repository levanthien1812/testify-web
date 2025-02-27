import { useEffect, useState } from "react";
import Input from "../../../components/elements/Input";
import Button from "../../../components/elements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faCircle,
    faFaceSmile,
    faImage,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery } from "react-query";
import {
    getMessages,
    sendMessage,
    updateReadMessagesByChatId,
} from "../../../services/chat";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import EmojiPicker from "emoji-picker-react";
import { useChatSocket } from "./ChatSocketContext";
import { ChatItf, MessageItf } from "../../../types/chat";
import {
    MUTATION_KEYS,
    QUERY_KEYS,
} from "../../../config/constants/queryMutationKeys";
import Loading from "../../../components/loadings/Loading";
import ChatInfo from "./ChatInfo";
import Message from "./Message";

const SelectedChat = () => {
    const {
        currentChat: chat,
        onlineUsers,
        setCurrentChat,
        sendMessage: sendMessageWS,
    } = useChatSocket();
    const [currentMessageText, setCurrentMessageText] = useState("");
    const user = useSelector((state: RootState) => state.auth.user);
    const [openEmoji, setOpenEmoji] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);

    const [images, setImages] = useState<string[]>([]);

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
            setCurrentChat({ ...chat, messages: data } as ChatItf);
        },
    });

    const { mutate: sendMessageMutate } = useMutation({
        mutationFn: async () => {
            const responseData = await sendMessage({
                chat_id: chat!.id,
                text: currentMessageText,
                images: images,
            });

            return responseData.message;
        },
        mutationKey: [MUTATION_KEYS.SEND_MESSAGE, chat!.id],
        onSuccess: (data) => {
            sendMessageWS(data);
            setCurrentMessageText("");
            setImages([]);
        },
    });

    const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && currentMessageText.length > 0) {
            sendMessageMutate();
        }
    };

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const promises: Promise<string>[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                const promise = new Promise<string>((resolve) => {
                    reader.onloadend = () => {
                        if (typeof reader.result === "string") {
                            resolve(reader.result);
                        }
                    };
                });

                reader.readAsDataURL(file);
                promises.push(promise);
            }

            Promise.all(promises).then((results) => {
                console.log(results);
                setImages((prevImages) => [...prevImages, ...results]);
            });
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImages((prevImages) =>
            prevImages.filter((_, index) => index !== indexToRemove)
        );
    };

    useEffect(() => {
        if (chat && chat.messages?.length > 0) {
            updateReadMessageMutate();
        }
    }, [updateReadMessageMutate]);

    return (
        <>
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
                                icon={
                                    !openInfo ? faChevronRight : faChevronLeft
                                }
                                className="w-3 h-3 text-gray-700"
                            />
                        </button>
                    </div>
                    <div className="grow py-2 custom-scrollbar-y pe-1">
                        {messagesLoading && (
                            <Loading
                                isLoading={messagesLoading}
                                loadingText={{ text: "Loading messages..." }}
                            />
                        )}
                        <div className="">
                            {chat &&
                                chat.messages &&
                                chat.messages.map((message, index) => (
                                    <Message message={message} index={index} />
                                ))}
                        </div>
                    </div>
                    <div className="border-t border-dashed border-gray-300">
                        <div
                            className={`flex gap-2 ${
                                images.length > 0 ? "py-2" : ""
                            } flex-wrap`}
                        >
                            {images.map((img, index) => (
                                <div
                                    className="relative w-[80px] h-[80px]"
                                    key={index}
                                >
                                    <img
                                        src={img}
                                        alt={`Preview ${index}`}
                                        className="rounded-xl w-full h-full object-cover shadow-md"
                                    />
                                    <button
                                        className="bg-gray-100 rounded-full hover:bg-orange-600 transition-all duration-150 ease-in-out absolute -top-1 -right-1 w-4 h-4 flex justify-center items-center z-10 hover:w-6 hover:h-6 p-2"
                                        onClick={() => removeImage(index)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            className="text-gray-500"
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex py-2 gap-2 items-center">
                            <Input
                                className="grow"
                                placeholder="Type a message"
                                value={currentMessageText}
                                onChange={(e) =>
                                    setCurrentMessageText(e.target.value)
                                }
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

                            <div>
                                <label htmlFor="image">
                                    <FontAwesomeIcon
                                        icon={faImage}
                                        className="text-gray-500 hover:text-orange-600 text-2xl transition-all duration-150"
                                    />
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="image"
                                    id="image"
                                    hidden
                                    onChange={handleChangeImage}
                                    multiple
                                />
                            </div>

                            <Button onClick={() => sendMessageMutate()}>
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {openInfo && <ChatInfo />}
        </>
    );
};

export default SelectedChat;
