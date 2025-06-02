import { useState } from "react";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../../components/modals/Modal";
import CreateTakers from "./CreateTakers";
import { useQuery } from "react-query";
import { getAvailableTakers } from "../../../../services/test";
import Button from "../../../../components/elements/Button";
import { TakerItf } from "../../../../types/types";
import TakersChoser from "./TakersChoser";
import { createTestActions } from "../../../../stores/createTest";
import { QUERY_KEYS } from "../../../../config/constants/queryMutationKeys";
import { useDispatch } from "react-redux";
import Loading from "../../../../components/loadings/Loading";
import { useAppSelector } from "../../../../hooks/hooks";

type AddTakersProps = {
    onClose: () => void;
};

const AddTakers = ({ onClose }: AddTakersProps) => {
    const [isCreateTaker, setIsCreateTaker] = useState<boolean>(false);
    const { testId, availableTakers, selectedTestTakers } = useAppSelector(
        (state) => state.createTest
    );
    const { setAvailableTakers } = createTestActions;
    const dispatch = useDispatch();

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
        dispatch(
            createTestActions.saveTestTakers({ testTakers: selectedTestTakers })
        );
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <ModalHeader title="Add takers" />
            <ModalBody>
                {!isCreateTaker && availableTakers && !isFetching && (
                    <TakersChoser
                        label="Select available takers"
                        selectedTestTakers={selectedTestTakers}
                        takers={availableTakers}
                        onSelect={(takers: TakerItf[]) =>
                            dispatch(
                                createTestActions.addSelectedTestTakers(takers)
                            )
                        }
                    />
                )}
                {isFetching && (
                    <Loading
                        loadingText={{ text: "Loading takers..." }}
                        isLoading={isFetching}
                    />
                )}

                {!isFetching && (
                    <button
                        className="text-blue-600 hover:underline mt-2 hover:font-bold"
                        onClick={() => setIsCreateTaker(true)}
                    >
                        Create new takers
                    </button>
                )}

                {isCreateTaker && (
                    <CreateTakers onClose={() => setIsCreateTaker(false)} />
                )}
            </ModalBody>
            <ModalFooter>
                <Button onClick={handleSave}>Save</Button>
            </ModalFooter>
        </Modal>
    );
};

export default AddTakers;
