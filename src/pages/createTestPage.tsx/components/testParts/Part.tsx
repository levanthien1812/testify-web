import React, { useEffect } from "react";
import { PartBodyItf, TestPartItf } from "../../../../types/types";
import { useMutation } from "react-query";
import { addPart, updatePart } from "../../../../services/test";
import { toast } from "react-toastify";
import Button from "../../../../components/elements/Button";
import Input from "../../../../components/elements/Input";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../../../stores/rootState";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import { TOAST_MESSAGES } from "../../../../config/constants/toasts";
import { createTestActions } from "../../../../stores/createTest";
import Accordion from "../../../../components/accordions/Accordion";
import { useDispatch } from "react-redux";
import { INITIAL_PART } from "../../../../config/constants/initialValues";
import { pickFieldsFromObject } from "../../../../utils/object";

const Part: React.FC<{
    part: TestPartItf;
}> = ({ part }) => {
    const { testId, maxScore, editibility } = useSelector(
        (state: RootState) => state.createTest
    );
    const { saveTestParts, validate: validateParts } = createTestActions;
    const dispatch = useDispatch();

    const { mutate: createPartMutate, isLoading: createPartLoading } =
        useMutation({
            mutationFn: async (partBody: PartBodyItf) =>
                await addPart(testId!, partBody),
            mutationKey: [MUTATION_KEYS.CREATE_PARTS, { body: part }],
            onSuccess: (data) => {
                dispatch(
                    saveTestParts({
                        partOrder: part.order,
                        partInfo: { id: data?.part?.id, is_saved: true },
                    })
                );
                dispatch(validateParts());
                toast.success(TOAST_MESSAGES.PART_ADDED_SUCCESSFULLY);
            },
        });

    const { mutate: updatePartMutate, isLoading: updatePartLoading } =
        useMutation({
            mutationFn: async (partBody: PartBodyItf) =>
                await updatePart(
                    testId!,
                    part.id!,
                    pickFieldsFromObject(partBody, INITIAL_PART)
                ),
            mutationKey: [
                MUTATION_KEYS.UPDATE_PART,
                { partId: part && part.id, body: part },
            ],
            onSuccess: (data) => {
                dispatch(validateParts());
                dispatch(
                    saveTestParts({
                        partOrder: part.order,
                        partInfo: { is_saved: true },
                    })
                );
                toast.success(TOAST_MESSAGES.PART_UPDATED_SUCCESSFULLY);
            },
        });

    const {
        handleSubmit,
        formState: { errors },
        register,
        watch,
    } = useForm<PartBodyItf>({
        defaultValues: part,
    });

    const onSubmit = (data: PartBodyItf) => {
        if (!part.id)
            createPartMutate(pickFieldsFromObject(data, INITIAL_PART));
        else updatePartMutate(pickFieldsFromObject(data, INITIAL_PART));
    };

    const allValues = watch();

    useEffect(() => {
        dispatch(
            saveTestParts({
                partOrder: part.order,
                partInfo: { ...allValues, is_saved: false },
            })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(allValues), saveTestParts, dispatch, part?.order]);

    return (
        <Accordion viewData={{ title: { text: `Part ${part.order}` } }}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="border border-gray-300 px-4 py-4 space-y-3"
            >
                <div className="grid grid-cols-[2fr_5fr] gap-2">
                    <Input
                        {...register("name", {
                            required: "Name is required",
                        })}
                        error={errors?.name && errors?.name.message}
                        label={{ text: "Name" }}
                        required
                        disabled={!editibility.TEST_PARTS.name}
                    />

                    <Input
                        {...register("description")}
                        error={
                            errors?.description && errors?.description.message
                        }
                        label={{ text: "Description" }}
                        disabled={!editibility.TEST_PARTS.description}
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
                        disabled={!editibility.TEST_PARTS.score}
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
                        disabled={!editibility.TEST_PARTS.num_questions}
                    />
                </div>

                <div className="flex justify-end gap-6 items-end">
                    {part?.is_saved && (
                        <p className="text-orange-600 italic">Part is saved</p>
                    )}
                    {!part?.is_saved && (
                        <Button
                            className="w-1/5"
                            type="submit"
                            disabled={createPartLoading || updatePartLoading}
                        >
                            {createPartLoading || updatePartLoading
                                ? "Saving..."
                                : "Save"}
                        </Button>
                    )}
                </div>
            </form>
        </Accordion>
    );
};

export default Part;
