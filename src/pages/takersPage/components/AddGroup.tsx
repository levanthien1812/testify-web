import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../components/modals/Modal";
import { useForm } from "react-hook-form";
import {
    TakerGroupBodyItf,
    TakerGroupItf,
    TakerItf,
} from "../../../types/types";
import { INITIAL_TAKER_GROUP } from "../../../config/constants/initialValues";
import Input from "../../../components/elements/Input";
import Button from "../../../components/elements/Button";
import { useMutation } from "react-query";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import { toast } from "react-toastify";
import { TOAST_MESSAGES } from "../../../config/constants/toasts";
import { createTakerGroup } from "../../../services/user";
import { useEffect, useState } from "react";
import { formatImageUrl } from "../../../utils/formatImageUrl";
import defaultUserPhoto from "../../../assets/images/default-user-photo.png";
import SelectByTyping from "../../../components/elements/SelectByTyping";

type AddGroupProps = {
    onClose: () => void;
    group?: TakerGroupItf;
    takers?: TakerItf[];
};

const AddGroup = ({ onClose, group, takers }: AddGroupProps) => {
    const [selectedTakers, setSelectedTakers] = useState<TakerItf[]>([]);

    const { mutate, isLoading } = useMutation({
        mutationFn: async (groupBody: TakerGroupBodyItf) => {
            const data = await createTakerGroup(groupBody);

            return data;
        },
        mutationKey: [MUTATION_KEYS.CREATE_TAKER_GROUP],
        onSuccess: (data) => {
            onClose();
            toast.success(TOAST_MESSAGES.CREATE_TAKER_GROUP_SUCCESSFULLY);
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<TakerGroupBodyItf>({
        defaultValues: group ? group : INITIAL_TAKER_GROUP,
    });

    const onSubmit = (data: TakerGroupBodyItf) => {
        console.log(data);
        mutate(data);
    };

    useEffect(() => {
        if (group && group.takers && takers) {
            setSelectedTakers(
                group.takers.map((takerId) => {
                    const taker = takers.find((taker) => taker.id === takerId);
                    return taker!;
                })
            );
        }
    }, [group, takers]);

    const handleSelectTaker = (takerId: string) => {
        const taker = takers!.find((taker) => taker.id === takerId);
        if (!taker) return;
        setSelectedTakers((prev) => [...prev, taker]);
        setValue(
            "takers",
            selectedTakers.map((taker) => taker.id!)
        );
    };

    return (
        <Modal onClose={onClose}>
            <ModalHeader title={"Add Group"} />
            <ModalBody>
                <form>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <Input
                                {...register("name", {
                                    required: {
                                        value: true,
                                        message: "Name is required",
                                    },
                                })}
                                label={{ text: "Name" }}
                                error={errors.name?.message}
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <Input
                                {...register("description")}
                                label={{ text: "Description" }}
                                error={errors.description?.message}
                            />
                        </div>
                        {takers && (
                            <div>
                                <p>Select takers:</p>
                                <div className="flex gap-2 mt-1 flex-wrap border p-2">
                                    {selectedTakers &&
                                        selectedTakers.map((taker) => (
                                            <div
                                                className="flex items-center justify-start gap-2 rounded-full py-1 px-2 shadow-sm border border-gray-300 bg-white"
                                                key={taker.id}
                                            >
                                                <img
                                                    className="w-5 h-5 rounded-full object-cover"
                                                    src={
                                                        taker.user.photo
                                                            ? formatImageUrl(
                                                                  taker.user
                                                                      .photo as string
                                                              )
                                                            : defaultUserPhoto
                                                    }
                                                    alt=""
                                                />
                                                <span>{taker.name}</span>
                                            </div>
                                        ))}
                                    <SelectByTyping
                                        options={takers.map((taker) => ({
                                            value: taker.id!,
                                            label: taker.name,
                                        }))}
                                        onSelect={handleSelectTaker}
                                        excludeSelectedValues
                                        selectedValues={selectedTakers.map(
                                            (taker) => taker.id!
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </ModalBody>
            <ModalFooter includeCancelBtn>
                <Button className="" primary onClick={handleSubmit(onSubmit)}>
                    {isLoading ? "Saving..." : "Save"}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AddGroup;
