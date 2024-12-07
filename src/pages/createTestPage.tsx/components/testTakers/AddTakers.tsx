import { useEffect, useState } from "react";
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
import { TakerItf, userItf } from "../../../../types/types";
import TakersChoser from "./TakersChoser";
import { useSelector } from "react-redux";
import { RootState } from "../../../../stores/rootState";
import { createTestActions } from "../../../../stores/createTest";
import { QUERY_KEYS } from "../../../../config/constants/queryMutationKeys";
import { useDispatch } from "react-redux";

type AddTakersProps = {
    onClose: () => void;
};

const AddTakers = ({ onClose }: AddTakersProps) => {
    const [isCreateTaker, setIsCreateTaker] = useState<boolean>(false);
    const { testId, testTakers, availableTakers } = useSelector(
        (state: RootState) => state.createTest
    );
    const { setAvailableTakers } = createTestActions;
    const dispatch = useDispatch();

    const { mutate, isLoading } = useMutation({
        mutationFn: async () => {
            await assignTakers(
                testId!,
                testTakers!.map((taker) => taker.email)
            );
        },
        onSuccess: () => {
            onClose();
        },
    });

    const { isFetching } = useQuery<TakerItf[]>({
        queryFn: async () => {
            const data = await getAvailableTakers(testId!);
            return data.takers;
        },
        queryKey: [QUERY_KEYS.GET_AVAILABLE_TAKERS, { testId: testId }],
        onSuccess: (data) => {
            dispatch(setAvailableTakers(data));
        },
    });

    const handleSave = () => {
        mutate();
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
                    <TakersChoser label="Select available takers" />
                )}

                <button
                    className="text-blue-600 hover:underline mt-2 hover:font-bold"
                    onClick={() => setIsCreateTaker(true)}
                >
                    Create new takers
                </button>

                {isCreateTaker && (
                    <CreateTakers onClose={() => setIsCreateTaker(false)} />
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
