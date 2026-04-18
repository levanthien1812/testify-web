import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/hooks";
import {
    addTemplatePart,
    moveTemplatePart,
    updateTemplatePart,
} from "../../../services/testTemplate";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import { PartBodyItf, TestPartItf } from "../../../types/types";
import { createTestTemplateActions } from "../../../stores/createTestTemplate";
import { TOAST_MESSAGES } from "../../../config/constants/toasts";
import { pickFieldsFromObject } from "../../../utils/object";
import { INITIAL_PART } from "../../../config/constants/initialValues";
import Accordion from "../../../components/accordions/Accordion";
import Input from "../../../components/elements/Input";
import Button from "../../../components/elements/Button";

const TemplatePart: React.FC<{
    part: TestPartItf;
}> = ({ part }) => {
    const { templateId, maxScore, numParts } = useAppSelector(
        (state) => state.createTestTemplate,
    );
    const [isEditing, setIsEditing] = useState(!part.id ? true : false);
    const [isDeleting, setIsDeleting] = useState(false);
    const {
        saveTemplateParts,
        movePart: movePartAction,
        validate,
    } = createTestTemplateActions;
    const dispatch = useDispatch();

    const { mutate: createPartMutate, isLoading: createPartLoading } =
        useMutation({
            mutationFn: async (partBody: PartBodyItf) =>
                await addTemplatePart(templateId!, partBody),
            mutationKey: [MUTATION_KEYS.CREATE_PARTS, { body: part }],
            onSuccess: (data) => {
                dispatch(saveTemplateParts({ ...data.part, is_saved: true }));
                setIsEditing(false);
                toast.success(TOAST_MESSAGES.PART_ADDED_SUCCESSFULLY);
                dispatch(validate());
            },
        });

    const { mutate: updatePartMutate, isLoading: updatePartLoading } =
        useMutation({
            mutationFn: async (partBody: Partial<PartBodyItf>) =>
                await updateTemplatePart(templateId!, part.id!, partBody),
            mutationKey: [
                MUTATION_KEYS.UPDATE_PART,
                { partId: part && part.id, body: part },
            ],
            onSuccess: (data) => {
                dispatch(
                    saveTemplateParts({
                        ...data.part,
                        is_saved: true,
                    }),
                );
                setIsEditing(false);
                toast.success(TOAST_MESSAGES.PART_UPDATED_SUCCESSFULLY);
                dispatch(validate());
            },
        });

    const { mutate: movePartMutate } = useMutation({
        mutationFn: async ({ direction }: { direction: "up" | "down" }) => {
            await moveTemplatePart(templateId!, part.id!, direction);
        },
        mutationKey: [MUTATION_KEYS.MOVE_PART, { partId: part && part.id }],
        onSuccess: () => {
            toast.success(TOAST_MESSAGES.PART_MOVED_SUCCESSFULLY);
        },
    });

    const {
        handleSubmit,
        formState: { errors },
        register,
        reset,
    } = useForm<PartBodyItf>({
        defaultValues: part,
    });

    const onSubmit = (data: PartBodyItf) => {
        const payload = pickFieldsFromObject(data, INITIAL_PART);
        if (!part.id) createPartMutate(payload);
        else updatePartMutate(payload);
    };

    const handleClickMoveUp = () => {
        dispatch(movePartAction({ partId: part.id!, direction: "up" }));
        movePartMutate({ direction: "up" });
    };

    const handleClickMoveDown = () => {
        dispatch(movePartAction({ partId: part.id!, direction: "down" }));
        movePartMutate({ direction: "down" });
    };

    const handleCancel = () => {
        reset();
        if (part.id) {
            setIsEditing(false);
        }
    };

    return (
        <Accordion
            viewData={{
                title: { text: `Part ${part.order}` },
                actions: [
                    {
                        text: "Edit",
                        onClick: () => {
                            setIsEditing(true);
                            dispatch(
                                saveTemplateParts({
                                    order: part.order,
                                    is_saved: false,
                                }),
                            );
                        },
                        disabled: isEditing || isDeleting,
                        display: !!part.id,
                    },
                    {
                        text: "Delete",
                        onClick: () => {
                            setIsDeleting(true);
                        },
                        disabled: isDeleting,
                        className: "text-red-500",
                        display: !!part.id,
                    },
                    {
                        text: "Move up",
                        onClick: handleClickMoveUp,
                        disabled: part.order === 1,
                        display: !!part.id,
                    },
                    {
                        text: "Move down",
                        onClick: handleClickMoveDown,
                        disabled: part.order === numParts,
                        display: !!part.id,
                    },
                ],
                open: true,
            }}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="border border-gray-300 px-2 sm:px-4 py-4 space-y-2 sm:space-y-3"
            >
                <div className="grid grid-cols-1 sm:grid-cols-[2fr_5fr] gap-1 sm:gap-2">
                    <Input
                        {...register("name", {
                            required: "Name is required",
                        })}
                        error={errors?.name && errors?.name.message}
                        label={{ text: "Name" }}
                        required
                        disabled={!isEditing}
                    />

                    <Input
                        {...register("description")}
                        error={
                            errors?.description && errors?.description.message
                        }
                        label={{ text: "Description" }}
                        disabled={!isEditing}
                    />
                    <Input
                        type="number"
                        min={0}
                        step={1}
                        {...register("score", {
                            required: "Score is required",
                            min: {
                                value: 1,
                                message: "Score must be greater than 0",
                            },
                            max: {
                                value: maxScore,
                                message:
                                    "Score must be less than template score",
                            },
                            valueAsNumber: true,
                        })}
                        error={errors?.score && errors?.score.message}
                        label={{ text: "Score" }}
                        required
                        disabled={!isEditing}
                    />

                    <Input
                        type="number"
                        min={0}
                        step={1}
                        {...register("num_questions", {
                            required: "Number of questions is required",
                            min: {
                                value: 1,
                                message:
                                    "Number of questions must be greater than 0",
                            },
                            valueAsNumber: true,
                        })}
                        error={
                            errors?.num_questions &&
                            errors?.num_questions.message
                        }
                        label={{ text: "Number of Questions" }}
                        required
                        disabled={!isEditing}
                    />
                </div>

                {part?.is_saved && (
                    <p className="text-orange-600 italic text-end">
                        Part is saved
                    </p>
                )}
                {isEditing && (
                    <div className="flex justify-end gap-6 items-end">
                        <Button
                            className="w-1/5"
                            type="button"
                            onClick={handleCancel}
                            secondary
                        >
                            Cancel
                        </Button>

                        <Button
                            className="w-1/5"
                            type="submit"
                            disabled={createPartLoading || updatePartLoading}
                        >
                            {createPartLoading || updatePartLoading
                                ? "Saving..."
                                : "Save"}
                        </Button>
                    </div>
                )}
            </form>
        </Accordion>
    );
};

export default TemplatePart;
