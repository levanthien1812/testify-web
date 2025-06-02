import { useChatSocket } from "../ChatSocketContext";
import AIChatHeader from "./AIChatHeader";
import AIMessages from "./AIMessages";
import AIInputMessage from "./AIInputMessage";
import { AIChatItf, AIChatMessageItf } from "../../../../types/chat";
import { QUERY_KEYS } from "../../../../config/constants/queryMutationKeys";
import { getMessagesAI } from "../../../../services/chat";
import { useQuery } from "react-query";
import Loading from "../../../../components/loadings/Loading";

const SelectedAIChat = () => {
    const { currentAIChat: chat, setCurrentAIChat } = useChatSocket();

    const { isLoading: messagesLoading } = useQuery<AIChatMessageItf[]>({
        queryKey: [QUERY_KEYS.GET_MESSAGES, chat!.id],
        queryFn: async () => {
            if (!chat || !chat.id) return [];
            const responseData = await getMessagesAI(chat.id);
            return responseData.messages;
        },
        onSuccess: (data: any) => {
            setCurrentAIChat({
                ...chat,
                messages: data,
            } as AIChatItf);
        },
    });

    return (
        <div className="flex shadow-md flex-[2] bg-white">
            <div className="flex flex-col grow">
                <AIChatHeader />
                {messagesLoading && (
                    <Loading
                        isLoading={messagesLoading}
                        loadingText={{ text: "Loading messages..." }}
                    />
                )}
                {chat?.messages && <AIMessages />}
                <AIInputMessage />
            </div>
        </div>
    );
};

export default SelectedAIChat;
