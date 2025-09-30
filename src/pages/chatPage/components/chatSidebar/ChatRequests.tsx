import {
    faCheck,
    faEllipsis,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery } from "react-query";
import {
    MUTATION_KEYS,
    QUERY_KEYS,
} from "../../../../config/constants/queryMutationKeys";
import {
    acceptChatRequest,
    getChatRequests,
    rejectChatRequest,
} from "../../../../services/chat";
import { ChatRequestItf } from "../../../../types/chat";
import Loading from "../../../../components/loadings/Loading";
import IconButton from "../../../../components/elements/IconButton";
import { useState } from "react";
import {
    CHAT_REQUEST_STATUS,
    CHAT_REQUEST_TYPE,
} from "../../../../config/constants/chat";

const ChatRequests = () => {
    const [requestType, setRequestType] = useState(CHAT_REQUEST_TYPE.INCOMING);

    const {
        data: requests,
        isLoading,
        refetch: refetchRequests,
    } = useQuery<ChatRequestItf[]>({
        queryKey: [QUERY_KEYS.GET_CHAT_REQUESTS, requestType],
        queryFn: async () => {
            const responseData = await getChatRequests({
                type: requestType,
                status: CHAT_REQUEST_STATUS.PENDING,
            });
            return responseData.requests;
        },
    });

    const { mutate: acceptRequestMutate, isLoading: isAcceptingRequest } =
        useMutation({
            mutationKey: MUTATION_KEYS.ACCEPT_CHAT_REQUEST,
            mutationFn: async (requestId: string) => {
                const responseData = await acceptChatRequest(requestId);
                return responseData;
            },
            onSuccess: () => {
                refetchRequests();
                console.log("Request accepted successfully");
            },
        });

    const { mutate: rejectRequestMutate, isLoading: isRejectingRequest } =
        useMutation({
            mutationKey: MUTATION_KEYS.REJECT_CHAT_REQUEST,
            mutationFn: async (requestId: string) => {
                const responseData = await rejectChatRequest(requestId);
                return responseData;
            },
            onSuccess: () => {
                refetchRequests();
                console.log("Request rejected successfully");
            },
        });

    const handleAccept = (requestId: string) => {
        acceptRequestMutate(requestId);
    };

    const handleReject = (requestId: string) => {
        rejectRequestMutate(requestId);
    };

    return (
        <div className="grow overflow-hidden flex flex-col">
            <div className="pt-2 pb-1 border-b border-dashed border-gray-300">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">Requests</h3>
                    <div className="border-none bg-gray-100 rounded-full flex justify-center items-center hover:bg-gray-200 leading-none w-6 h-6 cursor-pointer">
                        <FontAwesomeIcon icon={faEllipsis} />
                    </div>
                </div>
                <div className="flex gap-2 mt-1">
                    <button
                        className={`border-none bg-transparent text-gray-400 transition-all duration-100 ${
                            requestType === CHAT_REQUEST_TYPE.INCOMING
                                ? "text-orange-600 font-bold hover:text-orange-600 underline"
                                : ""
                        } hover:text-gray-600`}
                        onClick={() =>
                            setRequestType(CHAT_REQUEST_TYPE.INCOMING)
                        }
                    >
                        Incoming
                    </button>
                    <button
                        className={`border-none bg-transparent text-gray-400 transition-all duration-100 ${
                            requestType === CHAT_REQUEST_TYPE.OUTGOING
                                ? "text-orange-600 font-bold hover:text-orange-600 underline"
                                : ""
                        } hover:text-gray-600`}
                        onClick={() =>
                            setRequestType(CHAT_REQUEST_TYPE.OUTGOING)
                        }
                    >
                        Outgoing
                    </button>
                </div>
            </div>
            <div className="py-2 grow flex flex-col">
                <Loading
                    isLoading={isLoading}
                    loadingText={{ text: "Loading requests..." }}
                />
                {!isLoading && (!requests || requests.length === 0) && (
                    <p className="text-center text-gray-500 text-xl">
                        No new requests
                    </p>
                )}
                {requests && requests.length > 0 && (
                    <div className="space-y-2 grow custom-scrollbar-y">
                        {requests.map((request) => (
                            <div
                                key={request.id}
                                className="p-2 rounded-md bg-gray-100"
                            >
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold">
                                        {request.sender.name}
                                    </p>
                                    <div className="flex gap-3">
                                        <IconButton
                                            icon={faCheck}
                                            onClick={() =>
                                                handleAccept(request.id)
                                            }
                                            disabled={
                                                isAcceptingRequest ||
                                                isRejectingRequest
                                            }
                                            className="text-green-500 hover:text-green-500 font-bold"
                                        />
                                        <IconButton
                                            icon={faTimes}
                                            onClick={() =>
                                                handleReject(request.id)
                                            }
                                            disabled={
                                                isRejectingRequest ||
                                                isAcceptingRequest
                                            }
                                            className="text-red-500 hover:text-red-500 font-bold"
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 truncate">
                                    {request.message}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatRequests;
