import React from "react";
import Button from "../../../../components/elements/Button";
import Loading from "../../../../components/loadings/Loading";
import { useChatSocket } from "../ChatSocketContext";
import AIChats from "../AIChatList/AIChats";
import { useAppSelector } from "../../../../hooks/hooks";
import { AIChatItf, AIModelsItf } from "../../../../types/chat";
import Select from "../../../../components/elements/Select";
import { getModelsAI } from "../../../../services/chat";
import { QUERY_KEYS } from "../../../../config/constants/queryMutationKeys";
import { useQuery } from "react-query";

const AIChatList = ({ isLoadingChats }: { isLoadingChats: boolean }) => {
    const user = useAppSelector((state) => state.auth.user);

    const {
        aiChats,
        currentAIChat,
        setChattingWithAI,
        setAIChats,
        setCurrentAIChat,
        aiModels,
        selectedAIModel,
        setSelectedAIModel,
        setAIModels,
    } = useChatSocket();

    const handleClickChatWithAI = () => {
        setChattingWithAI(false);
    };

    const handleClickAddChat = () => {
        if (currentAIChat && !currentAIChat.id) return;

        const newAIChat: AIChatItf = {
            chat_name: "New chat",
            created_at: new Date().toISOString(),
            user_id: user!.id,
            messages: [],
            last_user_message_id: undefined,
            last_assistant_message_id: undefined,
        };
        setAIChats([...(aiChats || []), newAIChat]);
        setCurrentAIChat(newAIChat);
    };

    const handleAIModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAIModel(e.target.value);
    };

    const { isLoading: isLoadingModels } = useQuery<AIModelsItf[]>({
        queryKey: [QUERY_KEYS.GET_AI_MODELS],
        queryFn: async () => {
            const responseData = await getModelsAI();
            return responseData.models;
        },
        onSuccess: (data: any) => {
            setAIModels(data);
        },
        enabled: aiModels.length === 0,
    });

    return (
        <div className="p-2 bg-white shadow-md relative flex-[1] min-w-[30%]">
            <div className="flex justify-between py-2 border-b border-dashed border-gray-300">
                <h3 className="text-2xl font-bold">AI Chats</h3>
                <Button size="sm" onClick={handleClickAddChat}>
                    New chat
                </Button>
            </div>
            <div className="mt-2">
                {aiModels.length > 0 && selectedAIModel && (
                    <Select
                        options={aiModels.map((model) => ({
                            label: model.id,
                            value: model.id,
                        }))}
                        value={selectedAIModel}
                        onChange={handleAIModelChange}
                        label={{ text: "Select AI model" }}
                    />
                )}
            </div>
            <div className="mt-2">
                {isLoadingChats && (
                    <Loading
                        isLoading={isLoadingChats}
                        loadingText={{ text: "Loading chats" }}
                    />
                )}
                {aiChats && aiChats.length === 0 && !isLoadingChats && (
                    <p className="text-center text-gray-500 text-xl">
                        No conversation created yet
                    </p>
                )}
                {aiChats && aiChats.length > 0 && <AIChats />}

                <div className="absolute bottom-3 left-3">
                    <Button
                        style={{
                            backgroundColor: "#4158D0",
                            backgroundImage:
                                "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
                        }}
                        onClick={handleClickChatWithAI}
                    >
                        Back to chats
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AIChatList;
