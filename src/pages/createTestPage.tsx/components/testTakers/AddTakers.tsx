import { useState } from "react";
import Modal from "../../../../components/modals/Modal";
import AvailableTakers from "./AvailableTakers";
import CreateTakers from "./CreateTakers";
import { useMutation } from "react-query";
import { assignTakers } from "../../../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

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

    const handleSave = () => {
        mutate();
    };

    const handleAfterSelect = (takers: string[]) => {
        setSelectedTakers(takers);
    };

    return (
        <Modal onClose={onClose}>
            <Modal.Header onClose={onClose} title="Add takers" />
            <Modal.Body>
                {!isCreateTaker && (
                    <AvailableTakers
                        testId={testId}
                        onAfterSelect={handleAfterSelect}
                    />
                )}

                <button
                    className="text-blue-600 underline mt-2 hover:font-bold"
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
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-end gap-3">
                    <button
                        className="text-white px-9 py-0.5 bg-gray-500"
                        type="button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="text-white bg-orange-600 px-9 py-0.5 hover:bg-orange-700"
                        type="submit"
                        disabled={isLoading}
                        onClick={handleSave}
                    >
                        {!isLoading ? "Save" : "Saving..."}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default AddTakers;
