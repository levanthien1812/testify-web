import React, { ChangeEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { PartBodyItf, TestPartItf } from "../../../../types/types";
import { useMutation } from "react-query";
import { addPart, updatePart } from "../../../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { partSchema } from "../../../../validations/test";

const Part: React.FC<{
    testId: string;
    index: number;
    part: TestPartItf | null;
    onAfterUpdate: () => void;
}> = ({ part, onAfterUpdate, testId, index }) => {
    const [showSave, setShowSave] = useState(false);
    const [savable, setSavable] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(true);
    const [partBody, setPartBody] = useState<PartBodyItf>({
        name: "",
        order: index + 1,
        description: "",
        score: 0,
        num_questions: 0,
    });

    const { mutate: createPartMutate, isLoading: createPartLoading } =
        useMutation({
            mutationFn: async (partBody: PartBodyItf) =>
                await addPart(testId, partBody),
            mutationKey: ["add-part", { body: part }],
            onSuccess: (data) => {
                setShowSave(false);
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
                setShowSave(false);
                onAfterUpdate();
            },
            onError: (err) => {
                if (err instanceof AxiosError) {
                    toast.error(err.response?.data.message);
                }
            },
        });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let name: string, value: string | number | Date;
        name = e.target.name;
        value = e.target.value;

        if (["score", "num_questions"].includes(name)) {
            value = parseInt(value);
        }

        setShowSave(true);
        setPartBody({ ...partBody, [name]: value });
    };

    const handleSavePart = () => {
        if (!part) createPartMutate(partBody);
        else updatePartMutate(partBody);
    };

    useEffect(() => {
        const { error } = partSchema.validate(partBody);

        if (!error) {
            setSavable(true);
        } else {
            setSavable(false);
        }
    }, [partBody]);

    useEffect(() => {
        if (part) {
            setPartBody({
                name: part.name,
                description: part.description,
                order: part.order,
                score: part.score,
                num_questions: part.num_questions,
            });
        }
    }, [part]);

    return (
        <div className="">
            <div
                className="flex justify-between items-center px-4 py-2 bg-gray-300 cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
            >
                <p className="text-lg">Part {partBody.order}</p>
                <FontAwesomeIcon
                    icon={faChevronRight}
                    className={`text-sm transition-all ${
                        open ? "rotate-90" : "rotate-0"
                    }`}
                />
            </div>
            {open && (
                <div className="border border-gray-300 px-4 py-4 space-y-3">
                    <div className="flex gap-4 items-end">
                        <label htmlFor="name" className="w-1/5">
                            Part name:{" "}
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="border border-gray-500 px-2 py-1 focus:border-orange-600 outline-none grow"
                            value={partBody.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="flex gap-4 items-end">
                        <label htmlFor="description" className="w-1/5">
                            Description:{" "}
                        </label>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            className="border border-gray-500 px-2 py-1 focus:border-orange-600 outline-none grow"
                            value={partBody.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="flex gap-4 items-end mt-4">
                        <label htmlFor="score" className="w-1/5 shrink-0">
                            Score:{" "}
                        </label>
                        <input
                            type="number"
                            min={0}
                            id="score"
                            name="score"
                            className="border border-gray-500 px-2 py-1 w-0 focus:border-orange-600 outline-none grow"
                            value={partBody.score}
                            onChange={handleInputChange}
                            required
                        />
                        <label
                            htmlFor="num_questions"
                            className="w-1/5 shrink-0"
                        >
                            Num of questions:{" "}
                        </label>
                        <input
                            type="number"
                            step={1}
                            min={0}
                            id="num_questions"
                            name="num_questions"
                            className="border border-gray-500 px-2 py-1 w-0 focus:border-orange-600 outline-none grow"
                            value={partBody.num_questions}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
            )}
            {showSave && (
                <div className="flex justify-end">
                    {/* <button className="px-4 py-0.5 bg-gray-600 text-white w-1/5 hover:bg-gray-500">
                        Cancel
                    </button> */}
                    <button
                        className="px-4 py-0.5 bg-orange-600 text-white w-1/5 hover:bg-orange-500 disabled:bg-gray-500"
                        onClick={handleSavePart}
                        disabled={
                            !savable || createPartLoading || updatePartLoading
                        }
                    >
                        {createPartLoading || updatePartLoading
                            ? "Saving..."
                            : "Save"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Part;
