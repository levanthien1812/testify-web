import React, { useEffect, useState } from "react";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../components/modals/Modal";
import { useForm } from "react-hook-form";
import { TakerBodyItf, TakerItf } from "../../../types/types";
import { INITIAL_TAKER } from "../../../config/constants/initialValues";
import Input from "../../../components/elements/Input";
import Select from "../../../components/elements/Select";
import Button from "../../../components/elements/Button";
import { useMutation } from "react-query";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import { createTaker } from "../../../services/test";
import { toast } from "react-toastify";
import { TOAST_MESSAGES } from "../../../config/constants/toasts";
import { formatImageUrl } from "../../../utils/formatImageUrl";

type AddTakersProps = {
    onClose: () => void;
    taker?: TakerItf;
};

const AddTakers = ({ onClose, taker }: AddTakersProps) => {
    const [previewUrl, setPreviewURL] = useState<string | null>(
        taker && taker.photo ? formatImageUrl(taker.photo as string) : null
    );
    const [hoverPreview, setHoverPreview] = useState<boolean>(false);

    const { mutate, isLoading } = useMutation({
        mutationFn: async (takerBody: TakerBodyItf) => {
            const data = await createTaker(takerBody);

            return data;
        },
        mutationKey: [MUTATION_KEYS.CREATE_TAKERS],
        onSuccess: (data) => {
            onClose();
            toast.success(TOAST_MESSAGES.CREATE_TAKERS_SUCCESSFULLY);
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<TakerBodyItf>({
        defaultValues: taker ? taker : INITIAL_TAKER,
    });

    const onSubmit = (data: TakerBodyItf) => {
        mutate(data);
    };

    const photo = watch("photo");

    useEffect(() => {
        if (
            !photo ||
            typeof photo === "string" ||
            (photo as FileList).length === 0
        )
            return;
        const file = (photo as FileList)[0];
        setPreviewURL(URL.createObjectURL(file));
    }, [photo]);

    const handleRemoveImage = () => {
        setValue("photo", undefined);
        setPreviewURL(null);
    };

    return (
        <Modal onClose={onClose}>
            <ModalHeader title={"Add Takers"} />
            <ModalBody>
                <form>
                    <div className="flex gap-4">
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
                                    {...register("email", {
                                        required: {
                                            value: true,
                                            message: "Email is required",
                                        },
                                    })}
                                    label={{ text: "Email" }}
                                    error={errors.email?.message}
                                    type="email"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    options={[
                                        { value: "male", label: "Male" },
                                        { value: "female", label: "Female" },
                                    ]}
                                    {...register("gender", { required: false })}
                                    label={{ text: "Gender" }}
                                    error={errors.gender?.message}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    {...register("phone_number", {
                                        required: false,
                                    })}
                                    label={{ text: "Phone number" }}
                                    error={errors.phone_number?.message}
                                    type="tel"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    {...register("birthday", {
                                        required: false,
                                    })}
                                    label={{ text: "Birthday" }}
                                    error={errors.birthday?.message}
                                    type="date"
                                />
                            </div>
                        </div>
                        <div>
                            {previewUrl && (
                                <div
                                    className="w-full h-[160px] relative"
                                    onMouseOver={(e) => {
                                        setHoverPreview(true);
                                    }}
                                    onMouseLeave={() => setHoverPreview(false)}
                                >
                                    <img
                                        src={previewUrl}
                                        alt={`Preview`}
                                        className="rounded-xl w-full h-full object-cover shadow-md"
                                    />
                                    {hoverPreview && (
                                        <div className="absolute bottom-2 left-0 w-full flex justify-center">
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="bg-white bg-opacity-35 text-gray-700 hover:text-gray-800 px-2 text-sm border border-gray-400 rounded-md"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {!previewUrl && (
                                <div className="w-[160px] h-[160px] bg-gray-300 rounded-xl flex justify-center items-center">
                                    <span className="text-gray-500">
                                        No photo
                                    </span>
                                </div>
                            )}
                            <div className="mt-2">
                                <Input
                                    type="file"
                                    {...register("photo")}
                                    id="photo"
                                    label={{ text: "Select Photo" }}
                                    className="w-[160px]"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </ModalBody>
            <ModalFooter includeCancelBtn>
                <Button className="" primary onClick={handleSubmit(onSubmit)}>
                    Save
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AddTakers;
