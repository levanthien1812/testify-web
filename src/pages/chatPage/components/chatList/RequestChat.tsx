import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../../components/modals/Modal";
import Button from "../../../../components/elements/Button";
import { useQuery } from "react-query";
import { MakerItf, TakerItf } from "../../../../types/types";
import { getMakers } from "../../../../services/user";
import { useChatSocket } from "../ChatSocketContext";
import { QUERY_KEYS } from "../../../../config/constants/queryMutationKeys";
import { SOCKET_EVENTS } from "../../../../config/constants/socket";
import { useAppSelector } from "../../../../hooks/hooks";
import { useState } from "react";
import Input from "../../../../components/elements/Input";

const RequestChat = ({ onClose }: { onClose: () => void }) => {
    const { setAvailableMakers, socket } = useChatSocket();
    const [makerToRequest, setMakerToRequest] = useState<MakerItf | null>(null);
    const { user } = useAppSelector((state) => state.auth);
    const [requestMessage, setRequestMessage] = useState("");

    const { data: makers, isFetching } = useQuery<TakerItf[]>({
        queryFn: async () => {
            const data = await getMakers();
            return data.makers;
        },
        onSuccess: (data) => {
            setAvailableMakers(data);
        },
        queryKey: [QUERY_KEYS.GET_AVAILABLE_MAKERS],
    });

    const handleClickRequest = (maker: MakerItf) => {
        if (!makerToRequest) {
            setMakerToRequest(maker);
        } else {
            if (makerToRequest.id === maker.id) {
                handleSendRequest(maker);
                setMakerToRequest(null);
                setRequestMessage("");
            }
        }
    };

    const handleSendRequest = (maker: MakerItf) => {
        if (socket && user) {
            socket.emit(SOCKET_EVENTS.SEND_REQUEST_CHAT, {
                sender_id: user.id,
                receiver_id: maker.user.id,
                message: requestMessage,
            });
        }
    };

    return (
        <Modal onClose={onClose} width="sm:w-1/2 md:w-1/3 2xl:w-1/4">
            <ModalHeader title="Request Chat"></ModalHeader>
            <ModalBody>
                {isFetching && (
                    <p className="text-center text-gray-500">Loading...</p>
                )}
                {makers && makers.length > 0 && (
                    <div className="flex flex-col gap-2">
                        {makers.map((maker) => (
                            <div className="bg-orange-100 px-4 py-2">
                                <div
                                    className={`flex justify-between items-center gap-2 pb-2`}
                                    key={maker.id}
                                >
                                    <div>
                                        <div className="font-bold">
                                            {maker.user.name}
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {maker.user.email}
                                        </div>
                                    </div>
                                    <div>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                handleClickRequest(maker)
                                            }
                                        >
                                            Request
                                        </Button>
                                    </div>
                                </div>
                                {makerToRequest &&
                                    makerToRequest.id === maker.id && (
                                        <div className="py-2 border-t border-dashed border-gray-500">
                                            <Input
                                                placeholder="Message"
                                                sizing={"md"}
                                                value={requestMessage}
                                                onChange={(e) =>
                                                    setRequestMessage(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                )}
            </ModalBody>
            <ModalFooter></ModalFooter>
        </Modal>
    );
};

export default RequestChat;
