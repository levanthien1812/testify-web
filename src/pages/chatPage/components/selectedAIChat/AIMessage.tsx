import { useEffect, useRef, useState } from "react";
import { MESSAGE_AI_ROLE } from "../../../../config/constants/chat";
import {
    faCopy,
    faPen,
    faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import IconButton from "../../../../components/elements/IconButton";
import { useChatSocket } from "../ChatSocketContext";
import Input from "../../../../components/elements/Input";
import Button from "../../../../components/elements/Button";
import { useMutation } from "react-query";
import {
    regenerateMessageAI,
    updateMessageAI,
} from "../../../../services/chat";
import { AIChatMessageItf } from "../../../../types/chat";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import axios from "axios";

type AIMessageProps = {
    message: AIChatMessageItf;
};

const AIMessage = ({ message }: AIMessageProps) => {
    const {
        currentAIChat,
        selectedAIModel,
        setIsGeneratingResponse,
        setCurrentAIChat,
    } = useChatSocket();
    const [isHover, setIsHover] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedMessageText, setUpdatedMessageText] = useState<string>(
        message.content,
    );
    const cancelTokenSourceRef = useRef<any>(null);

    // Sync local state with streaming content from props
    useEffect(() => {
        if (!isEditing) {
            setUpdatedMessageText(message.content);
        }
    }, [message.content, isEditing]);

    const handleCLickCopyButton = () => {
        navigator.clipboard.writeText(message.content);
    };

    const handleCLickEditButton = () => {
        setIsEditing(true);
    };

    const { mutate: updateMessageMutate } = useMutation({
        mutationFn: async () => {
            cancelTokenSourceRef.current = axios.CancelToken.source();
            const responseData = await updateMessageAI(
                currentAIChat!.id!,
                message.id,
                selectedAIModel!,
                {
                    text: updatedMessageText,
                },
                cancelTokenSourceRef.current.token,
            );
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
                updatedMessages[updatedMessages.length - 1] = data.userMessage;
                updatedMessages?.push(data.assistantMessage);

                return {
                    ...prev!,
                    messages: updatedMessages,
                };
            });
        },
    });

    const { mutate: regenerateResponseMutate } = useMutation({
        mutationFn: async () => {
            cancelTokenSourceRef.current = axios.CancelToken.source();
            const responseData = await regenerateMessageAI(
                currentAIChat!.id!,
                selectedAIModel!,
                message.reply_to!,
                cancelTokenSourceRef.current.token,
            );
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
                updatedMessages?.push(data.assistantMessage);

                return {
                    ...prev!,
                    messages: updatedMessages,
                };
            });
        },
    });

    const handleUpdateMessage = () => {
        setCurrentAIChat((prev) => ({
            ...prev!,
            messages: prev!.messages.filter(
                (msg) => msg.reply_to !== message.id,
            ),
        }));
        setIsEditing(false);
        updateMessageMutate();
    };

    const handleRegenerateResponse = () => {
        setCurrentAIChat((prev) => ({
            ...prev!,
            messages: prev!.messages.filter((msg) => msg.id !== message.id),
        }));
        setIsGeneratingResponse(true);
        regenerateResponseMutate();
    };

    return (
        <div
            className={`flex flex-col gap-1 relative ${
                message.role === MESSAGE_AI_ROLE.USER
                    ? "items-end"
                    : "items-start"
            }`}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            {message.role === MESSAGE_AI_ROLE.ASSISTANT && (
                <div
                    className={`absolute -top-7 left-0 bg-gray-100 rounded-md p-1 flex gap-1 ${message.id === currentAIChat?.last_assistant_message_id || isHover ? "flex" : "hidden"}`}
                >
                    {message.id ===
                        currentAIChat?.last_assistant_message_id && (
                        <IconButton
                            icon={faRotateRight}
                            onClick={handleRegenerateResponse}
                        />
                    )}
                    <IconButton icon={faCopy} onClick={handleCLickCopyButton} />
                </div>
            )}
            {!isEditing && (
                <div className="flex gap-2 max-w-[80%] items-center">
                    {isHover &&
                        message.role === MESSAGE_AI_ROLE.USER &&
                        currentAIChat?.last_user_message_id === message.id && (
                            <div className="gap-2 flex">
                                <IconButton
                                    icon={faPen}
                                    onClick={handleCLickEditButton}
                                />
                            </div>
                        )}
                    <div
                        className={` ${
                            message.role === MESSAGE_AI_ROLE.USER
                                ? "bg-orange-600 text-white border-none"
                                : "border border-orange-600 bg-white text-black hover:shadow-md hover:shadow-orange-200"
                        } rounded-xl text-md py-2 px-4 leading-tight focus:ring-2 focus:ring-orange-600 whitespace-pre-wrap`}
                    >
                        {updatedMessageText}
                    </div>
                </div>
            )}
            {isEditing && (
                <div className="p-2 w-full bg-orange-100">
                    <Input
                        value={updatedMessageText}
                        onChange={(e) => setUpdatedMessageText(e.target.value)}
                    />

                    <div className="flex gap-2 mt-2 justify-end">
                        <Button
                            type="button"
                            secondary
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            primary
                            onClick={handleUpdateMessage}
                        >
                            Update
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIMessage;
