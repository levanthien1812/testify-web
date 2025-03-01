import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Input from "../../../components/elements/Input";
import Button from "../../../components/elements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFaceSmile,
    faImage,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "react-query";
import {
    sendMessage,
    updateReadMessagesByChatId,
} from "../../../services/chat";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import EmojiPicker from "emoji-picker-react";
import { useChatSocket } from "./ChatSocketContext";
import { ChatItf } from "../../../types/chat";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import { CLEAR_TYPING_INDICATOR_TIMEOUT } from "../../../config/config";

const InputMessage = () => {
    const {
        currentChat: chat,
        setCurrentChat,
        sendMessage: sendMessageWS,
        updateChatInChats,
        emitTyping,
    } = useChatSocket();
    const [openEmoji, setOpenEmoji] = useState(false);
    const inputMessageRef = useRef<HTMLInputElement>(null);
    const [currentMessageText, setCurrentMessageText] = useState("");
    const user = useSelector((state: RootState) => state.auth.user);
    const [isTyping, setIsTyping] = useState(false);
    const typeingTimeout = useRef<NodeJS.Timeout | null>(null);

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

    const { mutate: sendMessageMutate, isLoading: isSendingMessage } =
        useMutation({
            mutationFn: async () => {
                const responseData = await sendMessage({
                    chat_id: chat!.id,
                    text: currentMessageText,
                    images: images,
                    reply_to: chat?.message_being_replied?.id,
                });

                return responseData.message;
            },
            mutationKey: [MUTATION_KEYS.SEND_MESSAGE, chat!.id],
            onSuccess: (data) => {
                sendMessageWS(data);
                setCurrentMessageText("");
                setImages([]);
                updateChatInChats(chat!.id, { message_being_replied: null });
                setCurrentChat({
                    ...chat,
                    message_being_replied: null,
                } as ChatItf);
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

    const handleRemoveImage = (indexToRemove: number) => {
        setImages((prevImages) =>
            prevImages.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleCancelReply = () => {
        updateChatInChats(chat!.id, {
            message_being_replied: null,
        } as ChatItf);
        setCurrentChat({ ...chat, message_being_replied: null } as ChatItf);
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentMessageText(e.target.value);
        if (e.target.value.length === 0) return;
        setIsTyping(true);

        if (typeingTimeout.current) {
            clearTimeout(typeingTimeout.current);
        }

        typeingTimeout.current = setTimeout(() => {
            setIsTyping(false);
        }, CLEAR_TYPING_INDICATOR_TIMEOUT);
    };

    useEffect(() => {
        if (chat && chat.messages?.length > 0) {
            updateReadMessageMutate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateReadMessageMutate]);

    const getSender = useCallback(
        (sender_id: string) => {
            return chat!.members.find(
                (member) => member.member.id === sender_id
            );
        },
        [chat]
    );

    useEffect(() => {
        if (chat?.message_being_replied && inputMessageRef.current) {
            inputMessageRef.current.focus();
        }
    }, [inputMessageRef, chat?.message_being_replied]);

    const senderName = useMemo(() => {
        if (!chat || !chat.message_being_replied) return "";
        return (
            getSender(chat.message_being_replied.sender_id)?.nick_name ||
            getSender(chat.message_being_replied.sender_id)?.member.name
        );
    }, [chat, getSender]);

    const typingSenderName = useMemo(() => {
        if (!chat || !chat.typing_info) return "";
        return (
            getSender(chat.typing_info.sender_id)?.nick_name ||
            getSender(chat.typing_info.sender_id)?.member.name
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chat?.typing_info?.sender_id, getSender]);

    useEffect(() => {
        emitTyping(isTyping, chat!.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTyping]);

    return (
        <div className="border-t border-dashed border-gray-300 py-2">
            {images.length > 0 && (
                <div className={`flex gap-2 py-2 flex-wrap`}>
                    {images.map((img, index) => (
                        <div className="relative w-[80px] h-[80px]" key={index}>
                            <img
                                src={img}
                                alt={`Preview ${index}`}
                                className="rounded-xl w-full h-full object-cover shadow-md"
                            />
                            <button
                                className="bg-gray-100 rounded-full hover:bg-orange-600 transition-all duration-150 ease-in-out absolute -top-1 -right-1 w-4 h-4 flex justify-center items-center z-10 hover:w-6 hover:h-6 p-2"
                                onClick={() => handleRemoveImage(index)}
                            >
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    className="text-gray-500"
                                />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {chat?.message_being_replied && (
                <div className="pt-1 flex justify-between items-start gap-2">
                    <div>
                        <p className="text-gray-600 text-sm leading-none">
                            Replying to {senderName}
                        </p>
                        <p className="leading-tight mt-0.5">
                            Message: {chat.message_being_replied.text}
                        </p>
                    </div>
                    <button
                        onClick={handleCancelReply}
                        className="text-sm text-gray-600 hover:text-orange-600 hover:underline"
                    >
                        Cancel
                    </button>
                </div>
            )}
            {chat?.typing_info && chat.typing_info.is_typing && (
                <div>
                    <p className="text-gray-600 text-sm">
                        {typingSenderName} is typing...
                    </p>
                </div>
            )}
            <div className="flex gap-2 items-center">
                <Input
                    className="grow"
                    placeholder="Type a message"
                    value={currentMessageText}
                    onChange={handleMessageChange}
                    onKeyDown={handlePressEnter}
                    ref={inputMessageRef}
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
                                        currentMessageText + emojiObject.emoji
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
                            className="text-gray-500 hover:text-orange-600 text-2xl transition-all duration-150 cursor-pointer"
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

                <Button
                    onClick={() => sendMessageMutate()}
                    disabled={isSendingMessage}
                >
                    {isSendingMessage ? "Sending..." : "Send"}
                </Button>
            </div>
        </div>
    );
};

export default InputMessage;
