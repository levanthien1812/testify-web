import { useState } from "react";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../../components/modals/Modal";
import CreateTakers from "./CreateTakers";
import { useMutation, useQuery } from "react-query";
import { assignTakers, getAvailableTakers } from "../../../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Button from "../../../../components/elements/Button";
import { userItf } from "../../../../types/types";
import TakersChoser from "./TakersChoser";

type AddTakersProps = {
    onClose: () => void;
    testId: string;
    onAfterUpdate: () => void;
};

const AddTakers = ({ onClose, testId, onAfterUpdate }: AddTakersProps) => {
    const [isCreateTaker, setIsCreateTaker] = useState<boolean>(false);
    const [selectedTakers, setSelectedTakers] = useState<string[]>([]);

    const { mutate, isLoading } = useMutation({
        mutationFn: async () => {
            await assignTakers(testId, selectedTakers);
        },
        onSuccess: () => {
            onAfterUpdate();
            onClose();
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        },
    });

    const { data: availableTakers, isFetching } = useQuery<userItf[]>({
        queryFn: async () => {
            const data = await getAvailableTakers(testId);
            return data.takers;
        },
        queryKey: ["getAvailableTakers", { testId: testId }],
        onError: (err) => {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        },
    });

    const handleSave = () => {
        mutate();
    };

    const handleAfterSelect = (takers: string[]) => {
        setSelectedTakers(takers);
    };

    return (
        <Modal onClose={onClose}>
            <ModalHeader title="Add takers" />
            <ModalBody>
                {isFetching && (
                    <p className="text-center text-gray-500">
                        Loading takers...
                    </p>
                )}
                {!isCreateTaker && availableTakers && (
                    <TakersChoser
                        onAfterSelect={handleAfterSelect}
                        takers={availableTakers}
                        label="Select available takers"
                    />
                )}

                <button
                    className="text-blue-600 hover:underline mt-2 hover:font-bold"
                    onClick={() => setIsCreateTaker(true)}
                >
                    Create new takers
                </button>

                {isCreateTaker && (
                    <CreateTakers
                        testId={testId}
                        onAfterUpdate={() => {
                            onAfterUpdate();
                            onClose();
                        }}
                        onClose={() => setIsCreateTaker(false)}
                    />
                )}
            </ModalBody>
            <ModalFooter>
                <Button disabled={isLoading} onClick={handleSave}>
                    {!isLoading ? "Save" : "Saving..."}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AddTakers;
