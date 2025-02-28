import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { ChatItf, MessageItf } from "../../../types/chat";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import { useChatSocket } from "./ChatSocketContext";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEdit,
    faInfoCircle,
    faPen,
    faReply,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "react-query";
import { deleteMessage } from "../../../services/chat";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import ConfirmModal from "../../../components/modals/ConfirmModal";
import { SOCKET_EVENTS } from "../../../config/constants/socket";
import MessageDetail from "./MessageDetail";
import { isEmojiOnly } from "../../../utils/message";

type MessageProps = {
    message: MessageItf;
    index: number;
    onClickReply?: () => void;
};

const Message = ({ message, index, onClickReply }: MessageProps) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const {
        currentChat,
        setCurrentChat,
        socket,
        removeDeletedMessage,
        updateChatInChats,
    } = useChatSocket();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showAllImages, setShowAllImages] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [isViewingDetail, setIsViewingDetail] = useState(false);

    const { mutate: deleteMessageMutate, isLoading: isDeletingMessage } =
        useMutation({
            mutationFn: async () => {
                const responseData = await deleteMessage(
                    message.chat_id,
                    message.id
                );

                return responseData.message;
            },
            mutationKey: [MUTATION_KEYS.DELETE_MESSAGE, message.id],
            onSuccess: (data) => {
                setCurrentChat({
                    ...currentChat,
                    messages: currentChat!.messages.filter(
                        (msg) => msg.id !== message.id
                    ),
                } as ChatItf);
                setIsConfirmingDelete(false);
                if (socket) {
                    socket.emit(SOCKET_EVENTS.DELETE_MESSAGE, message);
                }
            },
        });

    const handleClickShowAll = () => {
        setShowAllImages(true);
    };

    const handleClickDeleteMessage = () => {
        if (!message.deleted) {
            setIsConfirmingDelete(true);
        } else {
            removeDeletedMessage(message.id);
        }
    };

    const handleClickReply = () => {
        updateChatInChats(currentChat!.id, { message_being_replied: message });
        setCurrentChat({
            ...currentChat,
            message_being_replied: message,
        } as ChatItf);
        onClickReply && onClickReply();
    };

    const handleClickRepliedMessage = () => {};

    const handleDeleteMessage = () => {
        deleteMessageMutate();
    };

    useEffect(() => {
        if (currentChat?.messages && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [currentChat]);

    const getSender = useCallback(
        (sender_id: string) => {
            return currentChat!.members.find(
                (member) => member.member.id === sender_id
            );
        },
        [currentChat]
    );

    const senderName = useMemo(() => {
        if (!currentChat || !currentChat.message_being_replied) return "";
        return (
            getSender(currentChat.message_being_replied.sender_id)?.nick_name ||
            getSender(currentChat.message_being_replied.sender_id)?.member.name
        );
    }, [currentChat, getSender]);

    const repliedMessage = useMemo(() => {
        if (!currentChat || !message.reply_to) return null;
        return currentChat!.messages.find((msg) => msg.id === message.reply_to);
    }, [currentChat, message.reply_to]);

    return (
        <div
            key={message.id}
            className={`flex flex-col mb-1 `}
            ref={scrollRef}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <div
                className={`flex gap-1 ${
                    message.sender_id === user!.id
                        ? "flex-row-reverse"
                        : "flex-row"
                }`}
            >
                {message.sender_id !== user!.id &&
                    (currentChat!.messages[index + 1]?.sender_id !==
                    message.sender_id ? (
                        <div className="relative w-4 h-4 rounded-full shadow-md self-end">
                            <img
                                className=""
                                src={
                                    currentChat!.members.find(
                                        (member) =>
                                            member.member.id ===
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
                        className={`flex flex-col ${
                            message.sender_id === user!.id
                                ? "items-end"
                                : "items-start"
                        }`}
                    >
                        {!message.deleted && (
                            <>
                                {message.images &&
                                    message.images.length > 0 && (
                                        <div
                                            className={`grid gap-x-1 gap-y-1 flex-wrap ${
                                                message.sender_id === user!.id
                                                    ? ""
                                                    : ""
                                            }`}
                                            style={{
                                                gridTemplateColumns: `repeat(${
                                                    message.images.length > 3
                                                        ? 3
                                                        : message.images.length
                                                }, 80px)`,
                                            }}
                                        >
                                            {message.images
                                                .slice(
                                                    0,
                                                    showAllImages
                                                        ? message.images.length
                                                        : 3
                                                )
                                                .map((img, i) => (
                                                    <div
                                                        className="relative w-[80px] h-[80px]"
                                                        key={i}
                                                    >
                                                        <img
                                                            src={img}
                                                            alt={`Preview ${i}`}
                                                            className="rounded-xl w-full h-full object-cover shadow-md"
                                                        />
                                                        {message.images &&
                                                            message.images
                                                                .length > 3 &&
                                                            !showAllImages &&
                                                            i === 2 && (
                                                                <button
                                                                    className="absolute border-none w-full h-full rounded-xl bg-black bg-opacity-60 text-white text-xl top-0 left-0"
                                                                    onClick={
                                                                        handleClickShowAll
                                                                    }
                                                                >
                                                                    +
                                                                    {message
                                                                        .images
                                                                        .length -
                                                                        3}
                                                                </button>
                                                            )}
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                {showAllImages && (
                                    <button
                                        className="text-xs hover:underline hover:text-orange-600 text-gray-600"
                                        onClick={() => setShowAllImages(false)}
                                    >
                                        Hide
                                    </button>
                                )}
                                {message.reply_to && repliedMessage && (
                                    <div
                                        className={`${
                                            message.sender_id === user!.id
                                                ? "text-end"
                                                : "text-start"
                                        }`}
                                    >
                                        <p className="text-xs text-gray-500">
                                            Replied to: {senderName}
                                        </p>
                                        <p
                                            className="text-sm hover:text-orange-600 cursor-pointer"
                                            onClick={handleClickRepliedMessage}
                                        >
                                            {repliedMessage.text}
                                        </p>
                                    </div>
                                )}
                                {message.text.length > 0 &&
                                    !isEmojiOnly(message.text) && (
                                        <div
                                            className={`text-white rounded-full py-0.5 px-4 `}
                                            style={{
                                                backgroundColor:
                                                    currentChat!.appearances
                                                        .messages_color,
                                            }}
                                        >
                                            <p className="">{message.text}</p>
                                        </div>
                                    )}

                                {message.text.length > 0 &&
                                    isEmojiOnly(message.text) && (
                                        <div className={``}>
                                            <p className="text-lg">
                                                {message.text}
                                            </p>
                                        </div>
                                    )}
                            </>
                        )}
                        {message.deleted && (
                            <div className="rounded-full py-0.5 px-4 border border-gray-500 text-gray-500 bg-white italic select-none">
                                Message has been deleted!
                            </div>
                        )}
                    </div>
                </div>
                {isHover && (
                    <div className="flex items-center gap-1">
                        <button
                            className="border-none bg-transparent"
                            onClick={handleClickDeleteMessage}
                        >
                            <FontAwesomeIcon
                                icon={faTrash}
                                className="text-sm text-gray-300 hover:text-orange-600"
                            />
                        </button>
                        <button
                            className="border-none bg-transparent"
                            onClick={() => setIsViewingDetail(true)}
                        >
                            <FontAwesomeIcon
                                icon={faInfoCircle}
                                className="text-sm text-gray-300 hover:text-orange-600"
                            />
                        </button>
                        <button className="border-none bg-transparent">
                            <FontAwesomeIcon
                                icon={faPen}
                                className="text-sm text-gray-300 hover:text-orange-600"
                            />
                        </button>
                        {!message.deleted && (
                            <button
                                className="border-none bg-transparent"
                                onClick={handleClickReply}
                            >
                                <FontAwesomeIcon
                                    icon={faReply}
                                    className="text-sm text-gray-300 hover:text-orange-600"
                                />
                            </button>
                        )}
                    </div>
                )}
            </div>
            {index === currentChat!.messages.length - 1 && (
                <p
                    className={`leading-none text-xs mt-1 ${
                        message.sender_id === user!.id
                            ? "text-end"
                            : "text-start"
                    } text-gray-500`}
                >
                    {format(new Date(message.created_at), "HH:mm:ss")}
                </p>
            )}
            {isConfirmingDelete && (
                <ConfirmModal
                    title="Confirm deleting message?"
                    message="Do you really want to delete this message? This action can not be undone!"
                    onClose={() => setIsConfirmingDelete(false)}
                    onConfirm={handleDeleteMessage}
                    isConfirming={isDeletingMessage}
                />
            )}
            {isViewingDetail && (
                <MessageDetail
                    message={message}
                    onClose={() => setIsViewingDetail(false)}
                />
            )}
        </div>
    );
};

export default Message;
