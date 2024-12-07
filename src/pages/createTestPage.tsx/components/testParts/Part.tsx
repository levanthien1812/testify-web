import React, { useEffect, useMemo } from "react";
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
    const { testId } = useSelector((state: RootState) => state.createTest);
    const { saveTestParts, validate: validateParts } = createTestActions;
    const dispatch = useDispatch();

    const { mutate: createPartMutate, isLoading: createPartLoading } =
        useMutation({
            mutationFn: async (partBody: PartBodyItf) =>
                await addPart(testId!, partBody),
            mutationKey: [MUTATION_KEYS.CREATE_PARTS, { body: part }],
            onSuccess: (data) => {
                console.log(data);
                dispatch(
                    saveTestParts({
                        partOrder: part.order,
                        partInfo: { id: data?.part?.id },
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
        if (!part.id) createPartMutate(data);
        else updatePartMutate(data as Pick<PartBodyItf, keyof PartBodyItf>);
    };

    const allValues = watch();

    useEffect(() => {
        dispatch(
            saveTestParts({
                partOrder: part.order,
                partInfo: allValues,
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
                <div className="flex gap-4 items-end">
                    <label htmlFor="name" className="w-1/5 shrink-0">
                        Part name:{" "}
                    </label>
                    <Input
                        {...register("name", {
                            required: "Name is required",
                        })}
                        error={errors?.name && errors?.name.message}
                    />
                </div>
                <div className="flex gap-4 items-end">
                    <label htmlFor="description" className="w-1/5 shrink-0">
                        Description:{" "}
                    </label>
                    <Input
                        {...register("description")}
                        error={
                            errors?.description && errors?.description.message
                        }
                    />
                </div>
                <div className="flex gap-4 items-end mt-4">
                    <label htmlFor="score" className="w-1/5 shrink-0">
                        Score:{" "}
                    </label>
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
                            valueAsNumber: true,
                        })}
                        error={errors?.score && errors?.score.message}
                    />
                    <label htmlFor="num_questions" className="w-1/5 shrink-0">
                        Num of questions:{" "}
                    </label>
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
                    />
                </div>

                <div className="flex justify-end">
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
            </form>
        </Accordion>
    );
};

export default Part;
