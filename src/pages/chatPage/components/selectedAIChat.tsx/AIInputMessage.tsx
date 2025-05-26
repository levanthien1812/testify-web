import { faCircleStop, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import Button from "../../../../components/elements/Button";
import Input from "../../../../components/elements/Input";
import { useMutation } from "react-query";
import {
    createChatAI,
    createMessageAI,
    createMockMessageAI,
} from "../../../../services/chat";
import { useChatSocket } from "../ChatSocketContext";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import { MESSAGE_AI_ROLE } from "../../../../config/constants/chat";
import axios from "axios";

const AIInputMessage = () => {
    const [currentMessageText, setCurrentMessageText] = useState("");
    const inputMessageRef = useRef<HTMLInputElement>(null);
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
            mutationKey: [MUTATION_KEYS.CREATE_CHAT],
            onSuccess: (data: any) => {
                setCurrentAIChat({ ...currentAIChat, ...data });
                sendMessageMutate(data.id);
            },
        });

    const { mutate: sendMessageMutate, isLoading: isSendingMessage } =
        useMutation({
            mutationFn: async (chatId: string) => {
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
            mutationKey: [MUTATION_KEYS.SEND_MESSAGE, currentAIChat!.id],
            onSuccess: (data) => {
                setIsGeneratingResponse(false);

                setCurrentAIChat((prev) => {
                    const updatedMessages = [...prev!.messages];
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
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setCurrentMessageText(event.target.value);
    };

    const handleClickSendBtn = async () => {
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
        setCurrentMessageText("");
    };

    const handlePressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
                <Input
                    className="grow"
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
                {isSendingMessage && (
                    <Button onClick={handleClickStopBtn} className="px-2">
                        <FontAwesomeIcon icon={faCircleStop} />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AIInputMessage;
