import { forwardRef, useCallback, useMemo, useState } from "react";
import { ChatItf, MessageBody, MessageItf } from "../../../../types/chat";
import { useChatSocket } from "../ChatSocketContext";
import { format } from "date-fns";
import {
    faInfoCircle,
    faPen,
    faReply,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "react-query";
import { deleteMessage, updateMessage } from "../../../../services/chat";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import ConfirmModal from "../../../../components/modals/ConfirmModal";
import { SOCKET_EVENTS } from "../../../../config/constants/socket";
import MessageDetail from "./MessageDetail";
import { isEmojiOnly } from "../../../../utils/message";
import EmojiReaction from "./EmojiReaction";
import Images from "./Images";
import ReactionsCount from "./ReactionsCount";
import { Link } from "react-router-dom";
import {
    MESSAGE_BACKGROUND_COLORS,
    MESSAGE_FONT_SIZES,
} from "../../../../config/constants/chat";
import { useAppSelector } from "../../../../hooks/hooks";
import IconButton from "../../../../components/elements/IconButton";
import HtmlDisplay from "../../../../components/elements/HtmlDisplay";
import { SendReaction } from "../../../../types/socket";

type MessageProps = {
    message: MessageItf;
    index: number;
    onClickReply?: () => void;
    scrollToMessage: (
        id: string,
        options?: { focus: boolean; clearFocus: boolean }
    ) => void;
};

const Message = forwardRef<HTMLDivElement, MessageProps>(
    ({ message, index, onClickReply, scrollToMessage }: MessageProps, ref) => {
        const user = useAppSelector((state) => state.auth.user);
        const {
            currentChat,
            setCurrentChat,
            socket,
            removeMessage,
            updateChatInChats,
        } = useChatSocket();

        const [isHover, setIsHover] = useState(false);
        const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
        const [isViewingDetail, setIsViewingDetail] = useState(false);

        const enhancedMessageText = useMemo(() => {
            let updatedMessageText = message.text;

            if (
                currentChat?.curr_search_message_id === message.id &&
                currentChat?.search_string
            ) {
                updatedMessageText = updatedMessageText.replaceAll(
                    currentChat.search_string.trim(),
                    `<span class="bg-yellow-500">${currentChat.search_string}</span>`
                );
            }

            if (
                message.text.length > 0 &&
                !isEmojiOnly(message.text) &&
                message?.link_preview &&
                message.links
            ) {
                message.links.forEach((link) => {
                    updatedMessageText = updatedMessageText.replace(
                        link,
                        `<a href="${link}" target="_blank" class="underline hover:text-orange-600" rel="noopener noreferrer">${link}</a>`
                    );
                });
            }
            return updatedMessageText;
        }, [
            message.text,
            message.links,
            message.link_preview,
            currentChat?.curr_search_message_id,
            currentChat?.search_string,
            message.id,
        ]);

        const { mutate: deleteMessageMutate, isLoading: isDeletingMessage } =
            useMutation({
                mutationFn: async () => {
                    const responseData = await deleteMessage(
                        message.chat_id,
                        message.id
                    );

                    return responseData;
                },
                mutationKey: [MUTATION_KEYS.DELETE_MESSAGE, message.id],
                onSuccess: (data) => {
                    setIsConfirmingDelete(false);
                    if (socket && data?.deleted) {
                        socket.emit(SOCKET_EVENTS.DELETE_MESSAGE, message);
                    }
                    if (data.message?.removed_for) {
                        removeMessage(message.id);
                    }
                },
            });

        const { mutate: updateMessageMutate } = useMutation({
            mutationFn: async (messageBody: Partial<MessageBody>) => {
                const responseData = await updateMessage(
                    message.id,
                    messageBody
                );

                return responseData.message;
            },
            mutationKey: [MUTATION_KEYS.UPDATE_MESSAGE, message.id],
            onSuccess: (data) => {},
        });

        const handleClickDeleteMessage = () => {
            if (
                !message.deleted ||
                (message.remove_for && message.remove_for.includes(user!.id))
            ) {
                setIsConfirmingDelete(true);
            } else {
                removeMessage(message.id);
            }
        };

        const handleClickReply = () => {
            updateChatInChats(currentChat!.id, {
                message_being_replied: message,
            });
            setCurrentChat({
                ...currentChat,
                message_being_replied: message,
            } as ChatItf);
            onClickReply && onClickReply();
        };

        const handleClickRepliedMessage = () => {
            scrollToMessage(message.reply_to!);
        };

        const handleDeleteMessage = () => {
            deleteMessageMutate();
        };

        // useEffect(() => {
        //     scrollToMessage(message.id, false);
        // }, [message.id, scrollToMessage]);

        const repliedMessage = useMemo(() => {
            if (!currentChat || !message.reply_to) return null;
            return currentChat!.messages.find(
                (msg) => msg.id === message.reply_to
            );
        }, [currentChat, message.reply_to]);

        const getSender = useCallback(
            (sender_id: string) => {
                return currentChat!.members.find(
                    (member) => member.member.id === sender_id
                );
            },
            [currentChat]
        );

        const repliedName = useMemo(() => {
            if (!message.reply_to || !repliedMessage) return "";
            return (
                getSender(repliedMessage.sender_id)?.nick_name ||
                getSender(repliedMessage.sender_id)?.member.name
            );
        }, [message.reply_to, getSender, repliedMessage]);

        const isNextMessageDifferentSender = useMemo(() => {
            return (
                currentChat!.messages[index + 1]?.sender_id !==
                message.sender_id
            );
        }, [currentChat, message.sender_id, index]);

        const isMessageSentByCurrentUser = useMemo(() => {
            return message.sender_id === user!.id;
        }, [message.sender_id, user]);

        const handleClickEmoji = (emojiCode: string) => {
            const updatedReactions = message.reactions || [];
            const index = updatedReactions.findIndex(
                (reaction) => reaction.user_id === user!.id
            );
            let socketContent: SendReaction = {
                chat_id: message.chat_id,
                message: {
                    id: message.id,
                    sender_id: message.sender_id,
                    text: message.text,
                },
                reactions: updatedReactions,
                new_reaction: {
                    user: {
                        id: user!.id,
                        name: user!.name,
                        photo: user!.photo,
                    },
                    emoji: emojiCode,
                },
                type: "add",
            };

            if (index !== -1) {
                if (updatedReactions[index].emoji === emojiCode) {
                    updatedReactions.splice(index, 1);

                    socketContent.type = "remove";
                } else {
                    updatedReactions[index].emoji = emojiCode;
                    socketContent.type = "change";
                }
            } else {
                updatedReactions.push({
                    created_at: new Date().toISOString(),
                    emoji: emojiCode,
                    user_id: user!.id,
                });

                socketContent.type = "add";
            }

            if (socket) {
                socketContent.reactions = updatedReactions;
                socket.emit(SOCKET_EVENTS.SEND_REACTION, socketContent);
            }
            updateMessageMutate({
                reactions: updatedReactions,
            });
        };

        return (
            <div
                key={message.id}
                className={`flex flex-col ${
                    isNextMessageDifferentSender ? "mb-2" : "mb-1"
                } ${
                    message.reactions && message.reactions.length > 0
                        ? "mb-5"
                        : ""
                } `}
                ref={ref}
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
                    {message.sender_id !== user!.id && (
                        <>
                            {isNextMessageDifferentSender ? (
                                // Create AvatarWithStatus component
                                <div className="relative w-4 h-4 rounded-full shadow-md self-end shrink-0">
                                    <img
                                        className="w-full h-full object-cover rounded-full"
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
                            )}
                        </>
                    )}

                    <div className="max-w-[75%]">
                        <div
                            className={`flex flex-col relative w-full ${
                                isMessageSentByCurrentUser
                                    ? "items-end"
                                    : "items-start"
                            }`}
                        >
                            {!message.deleted && (
                                <>
                                    {message.images &&
                                        message.images.length > 0 && (
                                            <Images message={message} />
                                        )}
                                    {message.reply_to && repliedMessage && (
                                        <div
                                            className={`${
                                                isMessageSentByCurrentUser
                                                    ? "text-end"
                                                    : "text-start"
                                            }`}
                                        >
                                            <p className="text-xs text-gray-500">
                                                Replied to: {repliedName}
                                            </p>
                                            <p
                                                className="text-sm hover:text-orange-600 cursor-pointer"
                                                onClick={
                                                    handleClickRepliedMessage
                                                }
                                            >
                                                {repliedMessage.text}
                                            </p>
                                        </div>
                                    )}
                                    {message.text.length > 0 &&
                                        !isEmojiOnly(message.text) && (
                                            <div
                                                className={`w-full text-white rounded-xl text-md py-1 px-4 leading-tight focus:ring-2 focus:ring-orange-600`}
                                                style={{
                                                    backgroundColor: currentChat
                                                        ?.appearances
                                                        .messages_color
                                                        ? MESSAGE_BACKGROUND_COLORS[
                                                              currentChat!
                                                                  .appearances
                                                                  .messages_color
                                                          ].color_code
                                                        : "#000",
                                                    fontSize: currentChat
                                                        ?.appearances
                                                        .messages_font_size
                                                        ? MESSAGE_FONT_SIZES[
                                                              currentChat!
                                                                  .appearances
                                                                  .messages_font_size
                                                          ].font_size
                                                        : "16px",
                                                    lineHeight: currentChat
                                                        ?.appearances
                                                        .messages_font_size
                                                        ? MESSAGE_FONT_SIZES[
                                                              currentChat!
                                                                  .appearances
                                                                  .messages_font_size
                                                          ].line_height
                                                        : "1.5",
                                                }}
                                                id="message-text"
                                            >
                                                <HtmlDisplay
                                                    htmlContent={
                                                        enhancedMessageText
                                                    }
                                                    className="w-full break-words"
                                                />
                                                {message.link_preview &&
                                                    message.links &&
                                                    message.links.length >
                                                        0 && (
                                                        <div
                                                            className={`block ${
                                                                message.sender_id ===
                                                                user!.id
                                                                    ? "text-end"
                                                                    : "text-start"
                                                            }`}
                                                        >
                                                            <Link
                                                                to={
                                                                    message
                                                                        .links[0]
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={`w-[full] h-[150px] block`}
                                                            >
                                                                <img
                                                                    src={
                                                                        message.link_preview
                                                                    }
                                                                    alt="link-preview"
                                                                    className="w-full h-full object-cover rounded-xl"
                                                                />
                                                            </Link>
                                                        </div>
                                                    )}
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
                                    {message.reactions &&
                                        message.reactions.length > 0 && (
                                            <ReactionsCount
                                                reactions={message.reactions}
                                            />
                                        )}
                                </>
                            )}
                            {message.deleted && (
                                <div className="text-sm rounded-xl py-1 px-4 border border-gray-500 text-gray-500 bg-white italic select-none leading-tight">
                                    Message has been deleted!
                                </div>
                            )}
                            {isHover &&
                                !message.deleted &&
                                !currentChat?.is_chat_blocked && (
                                    <EmojiReaction
                                        onEmojiClick={handleClickEmoji}
                                        selectedEmoji={
                                            message.reactions?.find(
                                                (reaction) =>
                                                    reaction.user_id ===
                                                    user!.id
                                            )?.emoji
                                        }
                                        isMessageSentByCurrentUser={
                                            isMessageSentByCurrentUser
                                        }
                                    />
                                )}
                        </div>
                    </div>
                    {isHover && !currentChat?.is_chat_blocked && (
                        <div className="flex items-center gap-1">
                            <IconButton
                                icon={faTrash}
                                onClick={handleClickDeleteMessage}
                            />
                            <IconButton
                                icon={faInfoCircle}
                                onClick={() => setIsViewingDetail(true)}
                            />
                            {!message.deleted && (
                                <IconButton icon={faPen} onClick={() => {}} />
                            )}
                            {!message.deleted && (
                                <IconButton
                                    icon={faReply}
                                    onClick={handleClickReply}
                                />
                            )}
                        </div>
                    )}
                </div>
                {index === currentChat!.messages.length - 1 && (
                    <p
                        className={`leading-none text-xs mt-1 ${
                            isMessageSentByCurrentUser
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
    }
);

export default Message;
