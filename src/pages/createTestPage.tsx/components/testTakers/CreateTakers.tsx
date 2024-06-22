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

                    <button
                        className="py-0 mt-2 w-full bg-gray-200 hover:bg-gray-300 flex justify-center items-center"
                        onClick={handleAdd}
                    >
                        Add
                    </button>

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
                <button
                    className="text-white bg-orange-600 px-9 py-0.5 hover:bg-orange-700"
                    type="submit"
                    disabled={isLoading}
                    onClick={handleSave}
                >
                    {!isLoading ? "Save" : "Saving..."}
                </button>
            </ModalFooter>
        </Modal>
    );
};

export default CreateTakers;
