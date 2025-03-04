import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { getMessages } from "../../../services/chat";
import { useChatSocket } from "./ChatSocketContext";
import { ChatItf, MessageItf } from "../../../types/chat";
import { QUERY_KEYS } from "../../../config/constants/queryMutationKeys";
import Loading from "../../../components/loadings/Loading";
import Message from "./Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { motion } from "motion/react";
import { MESSAGES_PER_FETCH } from "../../../config/constants/chat";

const Messages = () => {
    const {
        currentChat: chat,
        setCurrentChat,
        updateChatInChats,
    } = useChatSocket();
    const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [isTargetVisible, setIsTargetVisible] = useState(true);
    const [fetchTimes, setFetchTimes] = useState<number>(1);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const { isLoading: messagesLoading, refetch: refetchMessages } = useQuery<
        MessageItf[]
    >({
        queryKey: [QUERY_KEYS.GET_MESSAGES, chat!.id],
        queryFn: async () => {
            const responseData = await getMessages(chat!.id, {
                page: fetchTimes,
                limit: MESSAGES_PER_FETCH,
            });
            return responseData.messages;
        },
        onSuccess: (data) => {
            const updatedMessages = [...data, ...chat!.messages];
            setCurrentChat({
                ...chat,
                messages: updatedMessages,
            } as ChatItf);
            updateChatInChats(chat!.id, {
                messages: updatedMessages,
            });
        },
        enabled: !!chat && chat.messages.length === 0,
    });

    const scrollToMessage = useCallback(
        (messageId: string, focus: boolean = true) => {
            if (messageRefs.current) {
                const targetMessage = messageRefs.current[messageId];
                if (!targetMessage) return;

                targetMessage.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                const targetMessageText =
                    targetMessage.querySelector("#message-text");
                if (!targetMessageText || !focus) return;

                const focusClasses = ["ring-2", "ring-orange-600"];

                targetMessageText.classList.add(...focusClasses);

                setTimeout(() => {
                    targetMessageText.classList.remove(...focusClasses);
                }, 1500);
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
        scrollToMessage(chat.messages[chat.messages.length - 1].id, false);
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
            return () => {
                if (messagesContainerRef.current) {
                    messagesContainerRef.current.removeEventListener(
                        "scroll",
                        handleScroll
                    );
                }
            };
        }
    }, [chat, checkMessageVisibility]);

    // Load more message when scroll up
    useEffect(() => {
        if (!chat || chat.messages.length === 0) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    chat!.messages.length >= fetchTimes * MESSAGES_PER_FETCH
                ) {
                    console.log("caught");
                    setFetchTimes((prev) => prev + 1);
                }
            },
            {
                threshold: 1,
            }
        );

        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = chat!.scroll_position || 0;
        }
        if (messageRefs.current[chat.messages[0].id]) {
            observer.observe(messageRefs.current[chat.messages[0].id]!);
        }

        return () => {
            if (messageRefs.current[chat.messages[0].id]) {
                observer.unobserve(messageRefs.current[chat.messages[0].id]!);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chat?.messages]);

    useEffect(() => {
        refetchMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchTimes]);

    useEffect(() => {
        if (chat && chat.messages.length > 0 && chat.scroll_position === 0) {
            scrollToMessage(
                chat!.messages[chat!.messages.length - 1].id,
                false
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chat]);

    return (
        <div
            className="grow py-2 custom-scrollbar-y pe-1"
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
                        chat.messages.map((message, index) => (
                            <Message
                                message={message}
                                index={index}
                                scrollToMessage={scrollToMessage}
                                ref={(el) =>
                                    (messageRefs.current[message.id] = el)
                                }
                                key={message.id}
                            />
                        ))}
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
