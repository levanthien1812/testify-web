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
        <div className="flex shadow-md flex-[2] absolute top-0 left-0 md:static h-full w-full bg-white">
            <div className="flex flex-col grow">
                <AIChatHeader />
                <Loading
                    isLoading={messagesLoading}
                    loadingText={{ text: "Loading messages..." }}
                />
                {chat?.messages && <AIMessages />}
                <AIInputMessage />
            </div>
        </div>
    );
};

export default SelectedAIChat;
