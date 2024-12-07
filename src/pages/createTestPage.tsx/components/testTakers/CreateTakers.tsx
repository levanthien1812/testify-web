import { ChangeEvent, useState } from "react";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../../components/modals/Modal";
import { TakerBodyItf } from "../../../../types/types";
import { useMutation } from "react-query";
import { createTakers } from "../../../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Button from "../../../../components/elements/Button";
import Input from "../../../../components/elements/Input";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import { useSelector } from "react-redux";
import { RootState } from "../../../../stores/rootState";
import { TOAST_MESSAGES } from "../../../../config/constants/toasts";
import { createTestActions } from "../../../../stores/createTest";
import { useDispatch } from "react-redux";

type CreateTakersProps = {
    onClose: () => void;
};

const CreateTakers = ({ onClose }: CreateTakersProps) => {
    const [takers, setTakers] = useState<TakerBodyItf[]>([
        { name: "", email: "" },
    ]);
    const { testId } = useSelector((state: RootState) => state.createTest);
    const { addTestTakers } = createTestActions;
    const dispatch = useDispatch();

    const { mutate, isLoading } = useMutation({
        mutationFn: async (takersBody: TakerBodyItf[]) => {
            const data = await createTakers(testId!, { takers: takersBody });

            return data;
        },
        mutationKey: [MUTATION_KEYS.CREATE_TAKERS, { testId: testId }],
        onSuccess: (data) => {
            onClose();
            toast.success(TOAST_MESSAGES.CREATE_TAKERS_SUCCESSFULLY);
            dispatch(addTestTakers(data.takers));
        },
    });

    const handleSave = async () => {
        mutate(takers);
    };

    const handleAdd = () => {
        setTakers((prev) => [...prev, { name: "", email: "" }]);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        const index = parseInt(name.split("_")[1]);
        const _name = name.split("_")[0] as "name" | "email";

        const updatedTakers = [...takers];
        updatedTakers[index][_name] = value;

        setTakers(updatedTakers);
    };

    return (
        <Modal onClose={onClose}>
            <ModalHeader title="Create takers" />
            <ModalBody>
                <div className="">
                    <div className="space-y-2">
                        {[...Array(takers.length)].map((item, index) => (
                            <div
                                className="flex justify-between gap-2"
                                key={index}
                            >
                                <Input
                                    type="text"
                                    className="grow"
                                    placeholder="Name"
                                    required
                                    name={`name_${index}`}
                                    value={takers[index].name}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    type="email"
                                    className="grow"
                                    placeholder="Email"
                                    required
                                    name={`email_${index}`}
                                    value={takers[index].email}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ))}
                    </div>

                    <Button
                        primary={false}
                        size="sm"
                        className="mt-2 w-full"
                        onClick={handleAdd}
                    >
                        Add
                    </Button>

                    <div className="flex gap-1 items-center mt-2">
                        <input
                            type="checkbox"
                            name="save-later"
                            id="save-later"
                        />
                        <label htmlFor="save-later" className="grow">
                            Save for later use
                        </label>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button disabled={isLoading} onClick={handleSave}>
                    {!isLoading ? "Save" : "Saving..."}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default CreateTakers;
