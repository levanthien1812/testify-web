import React, { useEffect, useState } from "react";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../components/modals/Modal";
import { useForm } from "react-hook-form";
import { TakerBodyItf, TakerGroupItf, TakerItf } from "../../../types/types";
import { INITIAL_TAKER } from "../../../config/constants/initialValues";
import Input from "../../../components/elements/Input";
import Select from "../../../components/elements/Select";
import Button from "../../../components/elements/Button";
import { useMutation } from "react-query";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import { createTaker, updateTaker } from "../../../services/test";
import { toast } from "react-toastify";
import { TOAST_MESSAGES } from "../../../config/constants/toasts";
import { formatImageUrl } from "../../../utils/formatImageUrl";
import { GENDER_OPTIONS } from "../../../config/constants/users";

type AddTakersProps = {
    onClose: () => void;
    taker?: TakerItf;
    takerGroups?: TakerGroupItf[];
};

const AddTakers = ({ onClose, taker, takerGroups }: AddTakersProps) => {
    const [previewUrl, setPreviewURL] = useState<string | null>(
        taker && taker.user.photo
            ? formatImageUrl(taker.user.photo as string)
            : null
    );
    const [hoverPreview, setHoverPreview] = useState<boolean>(false);

    const { mutate: createTakerMutate, isLoading: createTakerLoading } =
        useMutation({
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

    const { mutate: updateTakerMutate, isLoading: updateTakerLoading } =
        useMutation({
            mutationFn: async (takerBody: Partial<TakerBodyItf>) => {
                if (!taker) return;
                const data = await updateTaker(taker.id, takerBody);

                return data;
            },
            mutationKey: [MUTATION_KEYS.UPDATE_TAKER],
            onSuccess: (data) => {
                onClose();
                toast.success(TOAST_MESSAGES.UPDATE_TAKER_SUCCESSFULLY);
            },
        });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<TakerBodyItf>({
        defaultValues: taker
            ? {
                  name: taker.name,
                  email: taker.user.email,
                  birthday: taker.user.birthday,
                  gender: taker.user.gender,
                  phone_number: taker.user.phone_number,
                  group_id: taker.group_id,
                  photo: taker.user.photo,
              }
            : INITIAL_TAKER,
    });

    const onSubmit = (data: TakerBodyItf) => {
        if (taker) {
            updateTakerMutate(data);
        } else {
            createTakerMutate(data);
        }
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

    const takerGroupOptions =
        takerGroups
            ?.map((group) => ({
                value: group.id,
                label: group.name,
            }))
            .concat({ value: "", label: "No group" }) || [];

    return (
        <Modal onClose={onClose}>
            <ModalHeader title={taker ? "Update Taker" : "Add Taker"} />
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
                                    options={GENDER_OPTIONS}
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
                            {takerGroups && (
                                <div className="flex gap-2">
                                    <Select
                                        {...register("group_id", {
                                            required: false,
                                        })}
                                        label={{ text: "Group" }}
                                        error={errors.group_id?.message}
                                        options={takerGroupOptions}
                                        disabled={takerGroups.length === 0}
                                        defaultValue={""}
                                        helperText={
                                            takerGroups.length === 0
                                                ? "No group available!"
                                                : ""
                                        }
                                    />
                                </div>
                            )}
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
                    {createTakerLoading || updateTakerLoading
                        ? "Saving..."
                        : "Save"}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AddTakers;
