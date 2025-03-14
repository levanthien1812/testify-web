import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
    getMessages,
    updateReadMessagesByChatId,
} from "../../../../services/chat";
import { useChatSocket } from "../ChatSocketContext";
import { ChatItf, MessageItf } from "../../../../types/chat";
import {
    MUTATION_KEYS,
    QUERY_KEYS,
} from "../../../../config/constants/queryMutationKeys";
import Loading from "../../../../components/loadings/Loading";
import Message from "./Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { motion } from "motion/react";
import {
    MESSAGE_TYPE,
    MESSAGES_PER_FETCH,
} from "../../../../config/constants/chat";
import { getNum } from "../../../../utils/primitives";
import NotificationMessage from "./NotificationMessage";

const Messages = () => {
    const {
        currentChat: chat,
        setCurrentChat,
        updateChatInChats,
        incrementFetchTimes,
    } = useChatSocket();
    const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [isTargetVisible, setIsTargetVisible] = useState(true);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const { isLoading: messagesLoading, refetch: refetchMessages } = useQuery<
        MessageItf[]
    >({
        queryKey: [QUERY_KEYS.GET_MESSAGES, chat!.id],
        queryFn: async () => {
            const responseData = await getMessages(chat!.id, {
                page: chat?.fetch_times,
                limit: MESSAGES_PER_FETCH,
            });
            return responseData.messages;
        },
        onSuccess: (data) => {
            const updatedMessages = [...data, ...chat!.messages];
            setCurrentChat({
                ...chat,
                messages: updatedMessages,
                search_index:
                    data.length - 1 > 0
                        ? data.length + getNum(chat?.search_index)
                        : 0,
            } as ChatItf);
            updateChatInChats(chat!.id, {
                messages: updatedMessages,
            });
        },
        enabled: false,
    });

    const { mutate: updateReadMessageMutate } = useMutation({
        mutationFn: async () => {
            const responseData = await updateReadMessagesByChatId(chat!.id);

            return responseData.message;
        },
        mutationKey: [MUTATION_KEYS.UPDATE_MESSAGE, chat!.id],
        onSuccess: (data) => {
            setCurrentChat({ ...chat, unread_messages: [] } as ChatItf);
        },
    });

    const scrollToMessage = useCallback(
        (
            messageId: string,
            options: { focus: boolean; clearFocus: boolean } = {
                focus: false,
                clearFocus: false,
            }
        ) => {
            if (messageRefs.current) {
                const targetMessage = messageRefs.current[messageId];
                if (!targetMessage) return;

                targetMessage.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                const targetMessageText =
                    targetMessage.querySelector("#message-text");
                if (!targetMessageText || !options.focus) return;

                const focusClasses = ["ring-2", "ring-orange-600"];

                targetMessageText.classList.add(...focusClasses);

                if (options.clearFocus) {
                    setTimeout(() => {
                        targetMessageText.classList.remove(...focusClasses);
                    }, 1500);
                }
            }
        },
        [messageRefs]
    );

    const checkMessageVisibility = useCallback(() => {
        if (!chat || chat.messages.length === 0) return;
        const targetIndex = chat.messages.length - 1;
        const targetMessage = chat.messages[targetIndex];

        if (
            messagesContainerRef.current &&
            messageRefs.current[targetMessage.id]
        ) {
            const chatRect =
                messagesContainerRef.current?.getBoundingClientRect();
            const messageRect =
                messageRefs.current[targetMessage.id]?.getBoundingClientRect();

            if (!chatRect || !messageRect) return;

            const isVisible =
                messageRect.top >= chatRect.top &&
                messageRect.bottom <= chatRect.bottom;

            setIsTargetVisible(isVisible);
        }
    }, [chat]);

    const handleClickScrollDown = () => {
        if (!chat || chat.messages.length === 0) return;
        scrollToMessage(chat.messages[chat.messages.length - 1].id);
    };

    // Show/Hide scroll-to-bottom button when scrolling the messages
    useEffect(() => {
        if (!chat || chat.messages.length === 0) return;
        checkMessageVisibility();

        const handleScroll = () => {
            if (messagesContainerRef.current) {
                updateChatInChats(chat!.id, {
                    scroll_position: messagesContainerRef.current.scrollTop,
                });
            }
            checkMessageVisibility();
        };

        if (messagesContainerRef.current) {
            messagesContainerRef.current.addEventListener(
                "scroll",
                handleScroll
            );
        }
        return () => {
            if (messagesContainerRef.current) {
                messagesContainerRef.current.removeEventListener(
                    "scroll",
                    handleScroll
                );
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chat, checkMessageVisibility]);

    // Load more message when scroll up
    useEffect(() => {
        if (!chat || chat.messages.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    chat!.messages.length >=
                        chat.fetch_times! * MESSAGES_PER_FETCH
                ) {
                    incrementFetchTimes();
                }
            },
            {
                threshold: 1,
            }
        );

        if (
            chat.messages.length > 0 &&
            messageRefs.current[chat.messages[0].id]
        ) {
            observer.observe(messageRefs.current[chat.messages[0].id]!);
        }

        return () => {
            if (
                chat.messages.length > 0 &&
                messageRefs.current[chat.messages[0].id]
            ) {
                observer.unobserve(messageRefs.current[chat.messages[0].id]!);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chat?.messages]);

    useEffect(() => {
        if (!chat || chat.messages.length === 0) return;

        if (messagesContainerRef.current) {
            if (chat.scroll_position) {
                messagesContainerRef.current.scrollTop = chat.scroll_position;
                setCurrentChat({ ...chat, scroll_position: undefined });
            } else if (!chat.is_accessed) {
                messagesContainerRef.current.scrollTop =
                    messagesContainerRef.current.scrollHeight;
                setCurrentChat({ ...chat, is_accessed: true } as ChatItf);
            } else {
                messagesContainerRef.current.scrollTop +=
                    messagesContainerRef.current.scrollHeight / 6;
            }
        }
    }, [chat?.messages]);

    useEffect(() => {
        refetchMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chat?.fetch_times]);

    useEffect(() => {
        if (chat && chat.messages?.length > 0) {
            updateReadMessageMutate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chat?.id]);

    useEffect(() => {
        if (!chat || !chat.search_index) return;

        if (chat.search_result_no === 0 || chat.search_string?.length === 0) {
            if (
                chat.curr_search_message_id &&
                messageRefs.current[chat.curr_search_message_id]
            ) {
                const messageTextToBlur =
                    messageRefs.current[
                        chat.curr_search_message_id
                    ]?.querySelector("#message-text");

                messageTextToBlur?.classList.remove(
                    "ring-2",
                    "ring-600-orange"
                );
            }

            setCurrentChat({
                ...chat,
                prev_search_message_id: undefined,
                curr_search_message_id: undefined,
            });
            return;
        }

        if (
            chat.prev_search_message_id &&
            messageRefs.current[chat.prev_search_message_id]
        ) {
            const messageTextToBlur =
                messageRefs.current[chat.prev_search_message_id]?.querySelector(
                    "#message-text"
                );

            messageTextToBlur?.classList.remove("ring-2", "ring-600-orange");
        }

        if (chat.curr_search_message_id) {
            scrollToMessage(chat.curr_search_message_id, {
                focus: true,
                clearFocus: false,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chat?.search_result_no]);

    return (
        <div
            className="grow p-2 custom-scrollbar-y pe-1"
            ref={messagesContainerRef}
        >
            {messagesLoading && (
                <Loading
                    isLoading={messagesLoading}
                    loadingText={{ text: "Loading messages..." }}
                />
            )}
            <div className="relative">
                <div ref={sentinelRef}>
                    {chat &&
                        chat.messages &&
                        chat.messages.map((message, index) =>
                            message.type === MESSAGE_TYPE.MESSAGE ? (
                                <Message
                                    message={message}
                                    index={index}
                                    scrollToMessage={scrollToMessage}
                                    ref={(el) =>
                                        (messageRefs.current[message.id] = el)
                                    }
                                    key={message.id}
                                />
                            ) : (
                                <NotificationMessage
                                    message={message}
                                    index={index}
                                    key={message.id}
                                />
                            )
                        )}
                </div>
                {!isTargetVisible && (
                    <div className="sticky bottom-2 bg-transparent z-20 flex justify-center w-full">
                        <motion.button
                            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 w-10 h-10 flex items-center justify-center shadow-md"
                            onClick={handleClickScrollDown}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, type: "spring" }}
                        >
                            <FontAwesomeIcon
                                icon={faArrowDown}
                                className="text-gray-500 hover:text-orange-600"
                            />
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
