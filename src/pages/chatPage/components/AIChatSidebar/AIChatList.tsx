import React from "react";
import Button from "../../../../components/elements/Button";
import Loading from "../../../../components/loadings/Loading";
import { useChatSocket } from "../ChatSocketContext";
import AIChats from "./AIChats";
import { useAppSelector } from "../../../../hooks/hooks";
import { AIChatItf } from "../../../../types/chat";
import Select from "../../../../components/elements/Select";
import { useQuery } from "react-query";
import { getChatsAI } from "../../../../services/chat";
import { QUERY_KEYS } from "../../../../config/constants/queryMutationKeys";

const AIChatList = () => {
    const user = useAppSelector((state) => state.auth.user);

    const {
        aiChats,
        currentAIChat,
        setAIChats,
        setCurrentAIChat,
        aiModels,
        selectedAIModel,
        setSelectedAIModel,
    } = useChatSocket();

    const { isLoading: isLoadingChats } = useQuery<AIChatItf[]>({
        queryFn: async () => {
            const responseData = await getChatsAI();
            return responseData.chats;
        },
        queryKey: [QUERY_KEYS.GET_AI_CHATS],
        onSuccess: (data: AIChatItf[]) => {
            setAIChats(data);
        },
    });

    const handleClickAddChat = () => {
        if (currentAIChat && !currentAIChat.id) return;

        const newAIChat: AIChatItf = {
            chat_name: "New chat",
            created_at: new Date().toISOString(),
            user_id: user!.id,
            messages: [],
        };
        setAIChats([...(aiChats || []), newAIChat]);
        setCurrentAIChat(newAIChat);
    };

    const handleAIModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAIModel(e.target.value);
    };

    return (
        <div>
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
                <Loading
                    isLoading={isLoadingChats}
                    loadingText={{ text: "Loading chats" }}
                />

                {aiChats && aiChats.length === 0 && !isLoadingChats && (
                    <p className="text-center text-gray-500 text-xl">
                        No conversation created yet
                    </p>
                )}
                {aiChats && aiChats.length > 0 && <AIChats />}
            </div>
        </div>
    );
};

export default AIChatList;
