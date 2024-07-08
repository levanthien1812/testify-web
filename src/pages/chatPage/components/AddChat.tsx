import { useState } from "react";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../components/modals/Modal";
import Button from "../../../components/elements/Button";
import { useMutation, useQuery } from "react-query";
import { userItf } from "../../../types/types";
import { getTakers } from "../../../services/user";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import TakersChoser from "../../createTestPage.tsx/components/testTakers/TakersChoser";
import { createChats } from "../../../services/chat";
import { chatOptions } from "../../../config/config";

const AddChat = ({
    onClose,
    onAfterUpdate,
}: {
    onClose: () => void;
    onAfterUpdate: () => void;
}) => {
    const [selectedTakers, setSelectedTakers] = useState<string[]>([]);

    const { data: takers, isFetching } = useQuery<userItf[]>({
        queryFn: async () => {
            const data = await getTakers();
            return data.takers;
        },
        queryKey: ["getTakers"],
        onError: (err) => {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        },
    });

    const handleAfterSelect = (takers: string[]) => {
        setSelectedTakers(takers);
    };

    const { mutate, isLoading } = useMutation({
        mutationFn: async (option: string) => {
            await createChats(
                {
                    members: selectedTakers,
                },
                option
            );
        },
        onSuccess: () => {
            onClose();
            onAfterUpdate();
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        },
    });

    return (
        <Modal onClose={onClose}>
            <ModalHeader title="Add Chat"></ModalHeader>
            <ModalBody>
                {isFetching && (
                    <p className="text-center text-gray-500">Loading...</p>
                )}
                {takers && (
                    <TakersChoser
                        takers={takers}
                        onAfterSelect={handleAfterSelect}
                        label="Select member to create chat with"
                    />
                )}
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => mutate(chatOptions.GROUP)}>
                    Add group
                </Button>
                <Button onClick={() => mutate(chatOptions.INDIVIDUAL)}>
                    Add individual
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AddChat;
