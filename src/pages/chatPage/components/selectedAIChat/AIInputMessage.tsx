import { faCircleStop, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import Button from "../../../../components/elements/Button";
import { useMutation } from "react-query";
import { createChatAI, createMessageAI } from "../../../../services/chat";
import { useChatSocket } from "../ChatSocketContext";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import { MESSAGE_AI_ROLE } from "../../../../config/constants/chat";
import axios from "axios";
import TextArea from "../../../../components/elements/TextArea";

type Props = {
    initialMessage?: string;
};

const AIInputMessage = ({ initialMessage }: Props) => {
    const [currentMessageText, setCurrentMessageText] = useState(
        initialMessage || ""
    );
    const inputMessageRef = useRef<HTMLTextAreaElement>(null);
    const {
        currentAIChat,
        setCurrentAIChat,
        selectedAIModel,
        setIsGeneratingResponse,
    } = useChatSocket();
    const cancelTokenSourceRef = useRef<any>(null);

    const { mutate: createChatAIMutate, isLoading: isCreatingChat } =
        useMutation({
            mutationFn: async () => {
                const responseData = await createChatAI({
                    first_message: currentMessageText,
                    model: selectedAIModel!,
                });

                return responseData;
            },
            onMutate: () => {
                setIsGeneratingResponse(true);
            },
            mutationKey: [MUTATION_KEYS.CREATE_AI_CHAT],
            onSuccess: (data: any) => {
                setCurrentAIChat((prev) => ({ ...prev, ...data }));
                sendMessageMutate(data.id);
            },
        });

    const { mutate: sendMessageMutate, isLoading: isSendingMessage } =
        useMutation({
            mutationFn: async (chatId: string) => {
                setCurrentMessageText("");
                cancelTokenSourceRef.current = axios.CancelToken.source();
                const responseData = await createMessageAI(
                    chatId,
                    selectedAIModel!,
                    {
                        text: currentMessageText,
                    },
                    cancelTokenSourceRef.current.token
                );
                // const responseData = await createMockMessageAI(
                //     chatId,
                //     {
                //         text: currentMessageText,
                //     },
                //     5000,
                //     cancelTokenSourceRef.current.token
                // );

                return responseData.messages;
            },
            onMutate: () => {
                setIsGeneratingResponse(true);
            },
            mutationKey: [MUTATION_KEYS.SEND_MESSAGE],
            onSuccess: (data) => {
                setIsGeneratingResponse(false);

                setCurrentAIChat((prev) => {
                    const updatedMessages = [...prev!.messages];
                    console.log(updatedMessages);
                    updatedMessages[updatedMessages.length - 1] =
                        data.userMessage;
                    updatedMessages?.push(data.assistantMessage);

                    return {
                        ...prev!,
                        messages: updatedMessages,
                    };
                });
                inputMessageRef.current?.focus();
            },
        });

    const handleMessageChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setCurrentMessageText(event.target.value);
    };

    const handleClickSendBtn = async () => {
        if (!currentAIChat) return;
        setCurrentAIChat((prev) => ({
            ...prev!,
            messages: [
                ...prev!.messages,
                {
                    role: MESSAGE_AI_ROLE.USER,
                    content: currentMessageText,
                    id: "user-message",
                    created_at: new Date().toISOString(),
                },
            ],
        }));
        if (!currentAIChat || !currentAIChat.id) {
            createChatAIMutate();
        } else {
            sendMessageMutate(currentAIChat.id);
        }
    };

    const handlePressEnter = (
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (event.key === "Enter") {
            handleClickSendBtn();
        }
    };

    const handleClickStopBtn = () => {
        setIsGeneratingResponse(false);
        if (cancelTokenSourceRef.current) {
            cancelTokenSourceRef.current.cancel();
        }
        setCurrentMessageText("");
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
                    onKeyDown={handlePressEnter}
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
