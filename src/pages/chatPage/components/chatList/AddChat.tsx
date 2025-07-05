import { useState } from "react";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../../components/modals/Modal";
import Button from "../../../../components/elements/Button";
import { useMutation, useQuery } from "react-query";
import { TakerItf, UserItf } from "../../../../types/types";
import { getTakers } from "../../../../services/user";
import TakersChoser from "../../../createTestPage/components/testTakers/TakersChoser";
import { createChats } from "../../../../services/chat";
import { CHAT_OPTIONS } from "../../../../config/constants/chat";
import { useChatSocket } from "../ChatSocketContext";
import { QUERY_KEYS } from "../../../../config/constants/queryMutationKeys";
import { SOCKET_EVENTS } from "../../../../config/constants/socket";

const AddChat = ({ onClose }: { onClose: () => void }) => {
    const [selectedTakers, setSelectedTakers] = useState<TakerItf[]>([]);
    const { availableTakers, setAvailableTakers, socket, setChats, chats } =
        useChatSocket();

    const { data: takers, isFetching } = useQuery<TakerItf[]>({
        queryFn: async () => {
            const data = await getTakers();
            return data.takers;
        },
        onSuccess: (data) => {
            setAvailableTakers(data);
        },
        queryKey: [QUERY_KEYS.GET_AVAILABLE_TAKERS],
    });

    const handleAfterSelect = (takers: TakerItf[]) => {
        setSelectedTakers(takers);
    };

    const { mutate, isLoading } = useMutation({
        mutationFn: async (option: string) => {
            const responseData = await createChats(
                {
                    members: selectedTakers.map((taker) => taker.id!),
                },
                option as CHAT_OPTIONS
            );

            return responseData;
        },
        onSuccess: (data) => {
            onClose();
            if (socket) {
                socket.emit(SOCKET_EVENTS.ADD_CHATS, data);
            }
        },
    });

    const handleAddIndividual = () => {
        mutate(CHAT_OPTIONS.INDIVIDUAL);
    };

    const handleAddGroup = () => {
        mutate(CHAT_OPTIONS.GROUP);
    };

    return (
        <Modal onClose={onClose}>
            <ModalHeader title="Add Chat"></ModalHeader>
            <ModalBody>
                {isFetching && (
                    <p className="text-center text-gray-500">Loading...</p>
                )}
                {takers && (
                    <TakersChoser
                        label="Select member to create chat with"
                        takers={availableTakers}
                        selectedTestTakers={selectedTakers}
                        onSelect={handleAfterSelect}
                    />
                )}
            </ModalBody>
            <ModalFooter>
                <Button onClick={handleAddGroup} disabled={isLoading}>
                    Add group
                </Button>
                <Button onClick={handleAddIndividual} disabled={isLoading}>
                    Add individual
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AddChat;
