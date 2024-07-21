import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { PartBodyItf, TestPartItf } from "../../../../types/types";
import { useMutation } from "react-query";
import { addPart, updatePart } from "../../../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Button from "../../../../components/elements/Button";
import Input from "../../../../components/elements/Input";
import { useForm } from "react-hook-form";

const Part: React.FC<{
    testId: string;
    index: number;
    part: TestPartItf | null;
    onAfterUpdate: () => void;
}> = ({ part, onAfterUpdate, testId, index }) => {
    const [open, setOpen] = useState<boolean>(true);
    const initialValues = useMemo(
        () =>
            !part
                ? {
                      name: "",
                      order: index + 1,
                      description: "",
                      score: 0,
                      num_questions: 0,
                  }
                : {
                      name: part.name,
                      order: part.order,
                      description: part.description,
                      score: part.score,
                      num_questions: part.num_questions,
                  },
        [part]
    );

    const { mutate: createPartMutate, isLoading: createPartLoading } =
        useMutation({
            mutationFn: async (partBody: PartBodyItf) =>
                await addPart(testId, partBody),
            mutationKey: ["add-part", { body: part }],
            onSuccess: (data) => {
                toast.success("Part added successfully");
                onAfterUpdate();
            },
            onError: (err) => {
                if (err instanceof AxiosError) {
                    toast.error(err.response?.data.message);
                }
            },
        });

    const { mutate: updatePartMutate, isLoading: updatePartLoading } =
        useMutation({
            mutationFn: async (partBody: PartBodyItf) =>
                await updatePart(testId, part!._id, partBody),
            mutationKey: [
                "update-part",
                { partId: part && part._id, body: part },
            ],
            onSuccess: (data) => {
                toast.success("Part updated successfully");
                onAfterUpdate();
            },
            onError: (err) => {
                if (err instanceof AxiosError) {
                    toast.error(err.response?.data.message);
                }
            },
        });

    const {
        handleSubmit,
        formState: { errors },
        register,
        watch,
    } = useForm<PartBodyItf>({
        defaultValues: initialValues,
    });

    const onSubmit = (data: PartBodyItf) => {
        if (!part) createPartMutate(data);
        else updatePartMutate(data);
    };

    const order = watch("order");

    return (
        <div className="">
            <div
                className="flex justify-between items-center px-4 py-2 bg-gray-300 cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
            >
                <p className="text-lg">Part {order}</p>
                <FontAwesomeIcon
                    icon={faChevronRight}
                    className={`text-sm transition-all ${
                        open ? "rotate-90" : "rotate-0"
                    }`}
                />
            </div>
            {open && (
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
                            {...register("description", {
                                required: "Description is required",
                            })}
                            error={
                                errors?.description &&
                                errors?.description.message
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
                        <label
                            htmlFor="num_questions"
                            className="w-1/5 shrink-0"
                        >
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
            )}
        </div>
    );
};

export default Part;