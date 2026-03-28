import { faCircleStop, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import Button from "../../../../components/elements/Button";
import { useMutation } from "react-query";
import {
    createChatAI,
    createMessageAI,
    createMessageAIStream,
} from "../../../../services/chat";
import { useChatSocket } from "../ChatSocketContext";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import { MESSAGE_AI_ROLE } from "../../../../config/constants/chat";
import TextArea from "../../../../components/elements/TextArea";

type Props = {
    initialMessage?: string;
};

const AIInputMessage = ({ initialMessage }: Props) => {
    const [currentMessageText, setCurrentMessageText] = useState(
        initialMessage || "",
    );
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const inputMessageRef = useRef<HTMLTextAreaElement>(null);
    const {
        currentAIChat,
        setCurrentAIChat,
        selectedAIModel,
        setIsGeneratingResponse,
    } = useChatSocket();

    const abortControllerRef = useRef<AbortController | null>(null);

    const { mutate: createChatAIMutate, isLoading: isCreatingChat } =
        useMutation({
            mutationFn: async (firstMessage: string) => {
                const responseData = await createChatAI({
                    first_message: firstMessage,
                    model: selectedAIModel!,
                });

                return { ...responseData, firstMessage };
            },
            onMutate: () => {
                setIsGeneratingResponse(true);
            },
            mutationKey: [MUTATION_KEYS.CREATE_AI_CHAT],
            onSuccess: (data: any) => {
                setCurrentAIChat((prev) => ({ ...prev, ...data }));
                sendMessageMutate({
                    chatId: data.id,
                    message: data.firstMessage,
                });
            },
        });

    const { mutate: sendMessageMutate, isLoading: isSendingMessage } =
        useMutation({
            mutationFn: async ({
                chatId,
                message,
            }: {
                chatId: string;
                message: string;
            }) => {
                const assistantMsgId = "assistant-streaming-" + Date.now();
                abortControllerRef.current = new AbortController();

                // Optimistically add an empty assistant message to be populated by the stream
                setCurrentAIChat((prev) => ({
                    ...prev!,
                    messages: [
                        ...prev!.messages,
                        {
                            role: MESSAGE_AI_ROLE.ASSISTANT,
                            content: "",
                            id: assistantMsgId,
                            created_at: new Date().toISOString(),
                        },
                    ],
                }));

                const response = await createMessageAIStream(
                    chatId,
                    selectedAIModel!,
                    { text: message },
                    abortControllerRef.current.signal,
                );

                if (!response.ok) throw new Error("Failed to start stream");

                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                let accumulatedContent = "";
                let buffer = ""; // Buffer to store partial lines

                while (reader) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");

                    // Keep the last partial line in the buffer
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        if (
                            trimmedLine.startsWith("data: ") &&
                            trimmedLine !== "data: [DONE]"
                        ) {
                            const jsonStr = trimmedLine.substring(6);
                            try {
                                const parsed = JSON.parse(jsonStr);
                                if (parsed.content) {
                                    accumulatedContent += parsed.content;
                                }
                            } catch (error) {
                                console.error("Error parsing JSON:", error);
                            }
                        }
                    }

                    // Iteratively update the specific assistant message content
                    setCurrentAIChat((prev) => ({
                        ...prev!,
                        messages: prev!.messages.map((msg) =>
                            msg.id === assistantMsgId
                                ? { ...msg, content: accumulatedContent }
                                : msg,
                        ),
                    }));
                }
            },
            onMutate: () => {
                setIsGeneratingResponse(true);
            },
            mutationKey: [MUTATION_KEYS.SEND_MESSAGE],
            onSuccess: () => {
                setIsGeneratingResponse(false);
                inputMessageRef.current?.focus();
            },
            onError: () => {
                setIsGeneratingResponse(false);
            },
        });

    const handleMessageChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setCurrentMessageText(event.target.value);
    };

    const handleClickSendBtn = async () => {
        if (!currentAIChat) return;
        if (currentMessageText.length === 0) return;

        const messageToSend = currentMessageText;
        setCurrentAIChat((prev) => ({
            ...prev!,
            messages: [
                ...prev!.messages,
                {
                    role: MESSAGE_AI_ROLE.USER,
                    content: messageToSend,
                    id: "user-message",
                    created_at: new Date().toISOString(),
                },
            ],
        }));
        setCurrentMessageText("");
        setHistoryIndex(null);
        if (!currentAIChat || !currentAIChat.id) {
            createChatAIMutate(messageToSend);
        } else {
            sendMessageMutate({
                chatId: currentAIChat.id,
                message: messageToSend,
            });
        }
        handleSaveUserMessage(messageToSend);
    };
    const handleSaveUserMessage = (message: string) => {
        if (localStorage.getItem("user_messages")) {
            const existingMessages = JSON.parse(
                localStorage.getItem("user_messages") || "[]",
            );
            existingMessages.push(message);
            localStorage.setItem(
                "user_messages",
                JSON.stringify(existingMessages),
            );
        } else {
            localStorage.setItem("user_messages", JSON.stringify([message]));
        }
    };

    const handlePressKey = (
        event: React.KeyboardEvent<HTMLTextAreaElement>,
    ) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleClickSendBtn();
        }
        if (event.key === "ArrowUp") {
            const userMessages = JSON.parse(
                localStorage.getItem("user_messages") || "[]",
            );
            if (userMessages.length === 0) return;

            const newIndex =
                historyIndex === null
                    ? userMessages.length - 1
                    : Math.max(0, historyIndex - 1);
            setHistoryIndex(newIndex);
            setCurrentMessageText(userMessages[newIndex]);
        }
        if (event.key === "ArrowDown") {
            if (historyIndex === null) return;
            const userMessages = JSON.parse(
                localStorage.getItem("user_messages") || "[]",
            );
            const newIndex = historyIndex + 1;
            const isAtEnd = newIndex >= userMessages.length;

            setHistoryIndex(isAtEnd ? null : newIndex);
            setCurrentMessageText(isAtEnd ? "" : userMessages[newIndex]);
        }
    };

    const handleClickStopBtn = () => {
        setIsGeneratingResponse(false);
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setCurrentMessageText("");
        setHistoryIndex(null);
    };

    return (
        <div className="border-t border-dashed border-gray-300 p-2 bg-opacity-40 bg-white">
            <div className="flex gap-2 items-center">
                <TextArea
                    rows={1}
                    className="grow "
                    placeholder="Ask me anything..."
                    value={currentMessageText}
                    onChange={handleMessageChange}
                    onKeyDown={handlePressKey}
                    ref={inputMessageRef}
                />

                {!(isCreatingChat || isSendingMessage) && (
                    <Button onClick={handleClickSendBtn} className="px-2">
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </Button>
                )}
                {(isSendingMessage || isCreatingChat) && (
                    <Button onClick={handleClickStopBtn} className="px-2">
                        <FontAwesomeIcon icon={faCircleStop} />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AIInputMessage;
