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
import Button from "../../../authPage/components/Button";

type CreateTakersProps = {
    testId: string;
    onClose: () => void;
    onAfterUpdate: () => void;
};

const CreateTakers = ({
    testId,
    onClose,
    onAfterUpdate,
}: CreateTakersProps) => {
    const [takers, setTakers] = useState<TakerBodyItf[]>([
        { name: "", email: "" },
    ]);

    const { mutate, isLoading } = useMutation({
        mutationFn: async (takersBody: TakerBodyItf[]) => {
            const data = await createTakers(testId, { takers: takersBody });

            return data;
        },
        mutationKey: ["createTakers"],
        onSuccess: (data) => {
            onClose();
            onAfterUpdate();
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
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

        console.log(updatedTakers);
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
                                <input
                                    type="text"
                                    className="border border-gray-500 px-2 py-1 focus:border-orange-600 outline-none placeholder:italic grow"
                                    placeholder="Name"
                                    required
                                    name={`name_${index}`}
                                    value={takers[index].name}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="email"
                                    className="border border-gray-500 px-2 py-1 focus:border-orange-600 outline-none placeholder:italic grow"
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
