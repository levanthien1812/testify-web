import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/hooks";
import { formatImageUrl } from "../../utils/formatImageUrl";
import { useMutation, useQuery } from "react-query";
import { MakerItf, TakerGroupItf, UserBodyItf } from "../../types/types";
import {
    MUTATION_KEYS,
    QUERY_KEYS,
} from "../../config/constants/queryMutationKeys";
import { toast } from "react-toastify";
import { TOAST_MESSAGES } from "../../config/constants/toasts";
import { useForm } from "react-hook-form";
import { INITIAL_USER } from "../../config/constants/initialValues";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../components/modals/Modal";
import Input from "../../components/elements/Input";
import Button from "../../components/elements/Button";
import { GENDER_OPTIONS } from "../../config/constants/users";
import Select from "../../components/elements/Select";
import { getMakersWithGroup, updateUser } from "../../services/user";
import SetUpPassword from "./SetUpPassword";
import UpdatePassword from "./UpdatePassword";
import InlineLoading from "../../components/loadings/InlineLoading";
import { ROLES } from "../../config/constants/tests";
import { useDispatch } from "react-redux";
import { authActions } from "../../stores/auth";

type Props = {
    onClose: () => void;
};

const Profile = ({ onClose }: Props) => {
    const user = useAppSelector((state) => state.auth.user);
    const [isSettingUpPassword, setIsSettingUpPassword] =
        useState<boolean>(false);
    const [isUpdatingPassword, setIsUpdatingPassword] =
        useState<boolean>(false);
    const [previewUrl, setPreviewURL] = useState<string | null>(
        user && user.photo ? formatImageUrl(user.photo as string) : null
    );
    const [editEmail, setEditEmail] = useState<boolean>(false);
    const [hoverPreview, setHoverPreview] = useState<boolean>(false);
    const dispatch = useDispatch();
    const { setUser } = authActions;

    const { mutate: updateUserMutate, isLoading: updateUserLoading } =
        useMutation({
            mutationFn: async (userBody: UserBodyItf) => {
                if (!user) return;
                const data = await updateUser(userBody);

                return data;
            },
            mutationKey: [MUTATION_KEYS.UPDATE_USER],
            onSuccess: (data) => {
                onClose();
                toast.success(TOAST_MESSAGES.UPDATE_USER_SUCCESSFULLY);
                dispatch(setUser(data.user));
            },
        });

    const { data: makersWithGroup, isLoading: isLoadingMakersWithGroup } =
        useQuery<{ maker: MakerItf; group: TakerGroupItf | null }[]>({
            queryFn: async () => {
                const data = await getMakersWithGroup();
                return data.makers;
            },
            queryKey: [QUERY_KEYS.GET_MAKERS_WITH_GROUP],
            onSuccess: (data) => {
                console.log(data);
            },
        });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        unregister,
    } = useForm<UserBodyItf>({
        defaultValues: user
            ? {
                  name: user.name,
                  email: user.email,
                  birthday: user.birthday,
                  gender: user.gender,
                  phone_number: user.phone_number,
                  photo: user.photo,
                  password: "",
              }
            : INITIAL_USER,
    });

    const onSubmit = (data: UserBodyItf) => {
        if (user) {
            updateUserMutate(data);
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

    return (
        <Modal onClose={onClose} width="md:w-2/3">
            <ModalHeader title={"Profile"} />
            <ModalBody>
                <form>
                    <div className="flex flex-col md:flex-row gap-4">
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
                                <div className="w-full h-[160px] bg-gray-300 rounded-xl flex justify-center items-center">
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
                        <div className="flex flex-col gap-2 grow">
                            <div className="">
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
                                    helperText="If you change your email, you have to verify it again"
                                    disabled={!editEmail}
                                    onClick={() => setEditEmail(true)}
                                />
                            </div>
                            {!editEmail && (
                                <div className="flex justify-end">
                                    <Button
                                        link
                                        onClick={() => setEditEmail(true)}
                                        size="sm"
                                    >
                                        Edit email
                                    </Button>
                                </div>
                            )}
                            <div className="">
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
                            <div className="">
                                <Select
                                    options={GENDER_OPTIONS}
                                    {...register("gender", { required: false })}
                                    label={{ text: "Gender" }}
                                    error={errors.gender?.message}
                                />
                            </div>
                            <div className="">
                                <Input
                                    {...register("phone_number", {
                                        required: false,
                                    })}
                                    label={{ text: "Phone number" }}
                                    error={errors.phone_number?.message}
                                    type="tel"
                                />
                            </div>
                            <div className="">
                                <Input
                                    {...register("birthday", {
                                        required: false,
                                    })}
                                    label={{ text: "Birthday" }}
                                    error={errors.birthday?.message}
                                    type="date"
                                />
                            </div>
                            {user?.role === ROLES.TAKER && (
                                <div>
                                    <p>Your makers and groups:</p>
                                    <InlineLoading
                                        isLoading={isLoadingMakersWithGroup}
                                        loadingText={{
                                            text: "Loading makers...",
                                        }}
                                    />
                                    {makersWithGroup &&
                                        makersWithGroup.length > 0 && (
                                            <div className="flex flex-wrap space-x-2">
                                                {makersWithGroup.map(
                                                    (makerGroup) => (
                                                        <div
                                                            className="p-2 rounded-sm bg-orange-50 shadow-md"
                                                            key={
                                                                makerGroup.maker
                                                                    .id
                                                            }
                                                        >
                                                            <p>
                                                                {
                                                                    makerGroup
                                                                        .maker
                                                                        .user
                                                                        .name
                                                                }
                                                            </p>
                                                            {makerGroup.group && (
                                                                <p className="text-gray-500 text-sm">
                                                                    {
                                                                        makerGroup
                                                                            .group
                                                                            .name
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                </div>
                            )}
                            <div>
                                <div>
                                    {!isSettingUpPassword &&
                                        (!user?.password ||
                                            user?.password?.length === 0) && (
                                            <Button
                                                link
                                                onClick={() =>
                                                    setIsSettingUpPassword(true)
                                                }
                                            >
                                                Set up password
                                            </Button>
                                        )}
                                    {!isUpdatingPassword &&
                                        user?.password &&
                                        user?.password?.length > 0 && (
                                            <Button
                                                link
                                                onClick={() =>
                                                    setIsUpdatingPassword(true)
                                                }
                                            >
                                                Update password
                                            </Button>
                                        )}
                                    {(isUpdatingPassword ||
                                        isSettingUpPassword) && (
                                        <Button
                                            link
                                            onClick={() => {
                                                setIsSettingUpPassword(false);
                                                setIsUpdatingPassword(false);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>

                                {isSettingUpPassword && (
                                    <SetUpPassword
                                        register={register}
                                        errors={errors}
                                        watch={watch}
                                        unregister={unregister}
                                    />
                                )}
                                {isUpdatingPassword && (
                                    <UpdatePassword
                                        register={register}
                                        errors={errors}
                                        watch={watch}
                                        unregister={unregister}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </ModalBody>
            <ModalFooter includeCancelBtn>
                <Button className="" primary onClick={handleSubmit(onSubmit)}>
                    {updateUserLoading ? "Saving..." : "Save"}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default Profile;
