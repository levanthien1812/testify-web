import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import Button from "../../../../components/elements/Button";
import Input from "../../../../components/elements/Input";
import { useMutation } from "react-query";
import { createChatAI, createMessageAI } from "../../../../services/chat";
import { useChatSocket } from "../ChatSocketContext";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";

const AIInputMessage = () => {
    const [currentMessageText, setCurrentMessageText] = useState("");
    const inputMessageRef = useRef<HTMLInputElement>(null);
    const { currentAIChat, setCurrentAIChat } = useChatSocket();

    const { mutate: createChatAIMutate, isLoading: isCreatingChat } =
        useMutation({
            mutationFn: async () => {
                const responseData = await createChatAI({
                    chat_name: currentAIChat!.chat_name,
                });

                return responseData;
            },
            mutationKey: [MUTATION_KEYS.CREATE_CHAT],
            onSuccess: (data: any) => {
                setCurrentAIChat({ ...currentAIChat, ...data });
            },
        });

    const { mutate: sendMessageMutate, isLoading: isSendingMessage } =
        useMutation({
            mutationFn: async () => {
                if (!currentAIChat || !currentAIChat.id) return;

                const responseData = await createMessageAI(currentAIChat.id, {
                    text: currentMessageText,
                });

                return responseData.message;
            },
            mutationKey: [MUTATION_KEYS.SEND_MESSAGE, currentAIChat!.id],
            onSuccess: (data) => {
                setCurrentMessageText("");
                setCurrentAIChat({
                    ...currentAIChat!,
                    messages: [...currentAIChat!.messages, data],
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
        if (!currentAIChat || !currentAIChat.id) {
            createChatAIMutate();
        }
        setTimeout(() => {
            sendMessageMutate();
        }, 0);
    };

    const handlePressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleClickSendBtn();
        }
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

                <Button
                    onClick={handleClickSendBtn}
                    disabled={isSendingMessage || isCreatingChat}
                    className="px-2"
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
            </div>
        </div>
    );
};

export default AIInputMessage;
