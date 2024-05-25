import React, { ChangeEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { PartFormDataItf } from "../../../../types/types";
import { useMutation } from "react-query";
import { addPart } from "../../../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const Part: React.FC<{
    testId: string;
    part: PartFormDataItf;
    onAfterUpdate: () => void;
}> = ({ part, onAfterUpdate, testId }) => {
    const [savable, setSavable] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(true);
    const [partBody, setPartBody] = useState<PartFormDataItf>(part);

    const { mutate, isLoading } = useMutation({
        mutationFn: async (part: PartFormDataItf) =>
            await addPart(testId, part),
        mutationKey: ["add-part", { body: part }],
        onSuccess: (data) => {
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

        setPartBody({ ...partBody, [name]: value });
    };

    const handleSavePart = () => {
        if (partBody) mutate(partBody);
    };

    useEffect(() => {
        // do some checking
        setSavable(true);
    }, [partBody]);

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
                            step={5}
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
            {savable && (
                <div className="flex justify-end">
                    <button className="px-4 py-0.5 bg-gray-600 text-white w-1/5 hover:bg-gray-500">
                        Cancel
                    </button>
                    <button
                        className="px-4 py-0.5 bg-orange-600 text-white w-1/5 hover:bg-orange-500 "
                        onClick={handleSavePart}
                    >
                        Save
                    </button>
                </div>
            )}
        </div>
    );
};

export default Part;
