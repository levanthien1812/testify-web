import React, { useEffect, useState } from "react";
import { PartBodyItf, TestPartItf } from "../../../../types/types";
import { useMutation } from "react-query";
import { addPart, movePart, updatePart } from "../../../../services/test";
import { toast } from "react-toastify";
import Button from "../../../../components/elements/Button";
import Input from "../../../../components/elements/Input";
import { useForm } from "react-hook-form";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import { TOAST_MESSAGES } from "../../../../config/constants/toasts";
import { createTestActions } from "../../../../stores/createTest";
import Accordion from "../../../../components/accordions/Accordion";
import { useDispatch } from "react-redux";
import { INITIAL_PART } from "../../../../config/constants/initialValues";
import { pickFieldsFromObject } from "../../../../utils/object";
import { useAppSelector } from "../../../../hooks/hooks";

const Part: React.FC<{
    part: TestPartItf;
}> = ({ part }) => {
    const { testId, maxScore, editibility, numParts, openAllParts } =
        useAppSelector((state) => state.createTest);
    const [isEditting, setIsEditing] = useState(!part.id ? true : false);
    const [isDeleting, setIsDeleting] = useState(false);
    const {
        saveTestParts,
        validate: validateParts,
        movePart: movePartAction,
    } = createTestActions;
    const dispatch = useDispatch();

    const { mutate: createPartMutate, isLoading: createPartLoading } =
        useMutation({
            mutationFn: async (partBody: PartBodyItf) =>
                await addPart(testId!, partBody),
            mutationKey: [MUTATION_KEYS.CREATE_PARTS, { body: part }],
            onSuccess: (data) => {
                dispatch(saveTestParts({ ...data.part, is_saved: true }));
                dispatch(validateParts());
                setIsEditing(false);
                toast.success(TOAST_MESSAGES.PART_ADDED_SUCCESSFULLY);
            },
        });

    const { mutate: updatePartMutate, isLoading: updatePartLoading } =
        useMutation({
            mutationFn: async (partBody: Partial<PartBodyItf>) =>
                await updatePart(testId!, part.id!, partBody),
            mutationKey: [
                MUTATION_KEYS.UPDATE_PART,
                { partId: part && part.id, body: part },
            ],
            onSuccess: (data) => {
                dispatch(validateParts());
                dispatch(
                    saveTestParts({
                        ...data.part,
                        is_saved: true,
                    })
                );
                setIsEditing(false);
                toast.success(TOAST_MESSAGES.PART_UPDATED_SUCCESSFULLY);
            },
        });

    const { mutate: movePartMutate } = useMutation({
        mutationFn: async ({ direction }: { direction: "up" | "down" }) => {
            await movePart(testId!, part.id!, direction);
        },
        mutationKey: [MUTATION_KEYS.MOVE_PART, { partId: part && part.id }],
        onSuccess: (data) => {
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
        if (!part.id)
            createPartMutate(pickFieldsFromObject(data, INITIAL_PART));
        else updatePartMutate(pickFieldsFromObject(data, INITIAL_PART));
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
                                saveTestParts({
                                    order: part.order,
                                    is_saved: false,
                                })
                            );
                        },
                        disabled: isEditting || isDeleting,
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
                open: openAllParts,
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
                        disabled={!editibility.TEST_PARTS.name || !isEditting}
                    />

                    <Input
                        {...register("description")}
                        error={
                            errors?.description && errors?.description.message
                        }
                        label={{ text: "Description" }}
                        disabled={
                            !editibility.TEST_PARTS.description || !isEditting
                        }
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
                                message: "Score must be less than test score",
                            },
                            valueAsNumber: true,
                        })}
                        error={errors?.score && errors?.score.message}
                        label={{ text: "Score" }}
                        required
                        disabled={!editibility.TEST_PARTS.score || !isEditting}
                    />
                    <Input
                        type="number"
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
                        label={{ text: "Number of questions" }}
                        required
                        disabled={
                            !editibility.TEST_PARTS.num_questions || !isEditting
                        }
                    />
                </div>

                {part?.is_saved && (
                    <p className="text-orange-600 italic text-end">
                        Part is saved
                    </p>
                )}
                {isEditting && (
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

export default Part;
