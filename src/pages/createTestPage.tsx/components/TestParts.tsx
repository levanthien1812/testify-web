import React, { ChangeEvent, useState } from "react";
import { PartFormDataItf, TestItf } from "../../../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "react-query";
import { addParts } from "../../../services/test";
import { partSchema } from "../../../validations/test";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const PartItem: React.FC<{
    part: PartFormDataItf;
    setPart: (part: PartFormDataItf) => void;
}> = ({ part, setPart }) => {
    const [open, setOpen] = useState<boolean>(true);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let name: string, value: string | number | Date;
        name = e.target.name;
        value = e.target.value;

        if (["score", "num_questions"].includes(name)) {
            value = parseInt(value);
        }

        setPart({ ...part, [name]: value });
    };

    return (
        <div className="border border-gray-300 ">
            <div
                className="flex justify-between items-center px-4 py-2 bg-gray-300 cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
            >
                <p className="text-lg">Part {part.order}</p>
                <FontAwesomeIcon
                    icon={faChevronRight}
                    className={`text-sm transition-all ${
                        open ? "rotate-90" : "rotate-0"
                    }`}
                />
            </div>
            {open && (
                <div className="px-4 py-4 space-y-3">
                    <div className="flex gap-4 items-end">
                        <label htmlFor="name" className="w-1/5">
                            Part name:{" "}
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="border border-gray-500 px-2 py-1 focus:border-orange-600 outline-none grow"
                            value={part.name}
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
                            value={part.description}
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
                            value={part.score}
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
                            value={part.num_questions}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const TestParts: React.FC<{
    test: TestItf;
    setTest: React.Dispatch<React.SetStateAction<TestItf | null>>;
    numParts: number;
    onBack: () => void;
    onNext: () => void;
}> = ({ test, setTest, numParts, onBack, onNext }) => {
    const { mutate, isLoading } = useMutation({
        mutationFn: async (parts: PartFormDataItf[]) =>
            await addParts(test._id, parts),
        mutationKey: ["add-parts", { body: test.parts }],
        onSuccess: (data) => {
            setTest({
                ...test,
                parts: data.test.parts,
                questions: data.test.questions,
            });
            onNext();
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        },
    });

    const handleBack = () => {
        onBack();
    };

    const handleNext = () => {
        if (numParts === 1) {
            onNext();
            return;
        }

        const { error } = partSchema.validate(test.parts);
        if (!error) {
            mutate(
                test.parts.map((part) => {
                    delete part._id;
                    return part;
                })
            );
        } else {
            toast.error(
                error.details
                    .map((detail) => {
                        return detail.message
                            .replace(
                                `[${detail.path[0]}].`,
                                `Part ${(detail.path[0] as number) + 1}'s `
                            )
                            .replaceAll('"', "");
                    })
                    .join(".\n ")
            );
        }
    };

    return (
        <div className="px-20 py-12 shadow-2xl">
            <h2 className="text-center text-3xl">Test Parts Information</h2>

            <div className="space-y-3 mt-4">
                <div className="flex gap-4">
                    <p>Total score: {test.max_score}</p>
                    <p>Total questions: {test.num_questions}</p>
                </div>
                {numParts > 1 &&
                    test.parts.map((part, index) => (
                        <PartItem
                            key={index}
                            part={part}
                            setPart={(part: PartFormDataItf) => {
                                const updatedParts = [...test.parts];
                                updatedParts[index] = part;
                                setTest({ ...test, parts: updatedParts });
                            }}
                        />
                    ))}
                {numParts === 1 && (
                    <div>
                        <p>
                            Your test doesn't have multiple parts so you can
                            skip this section
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-end items-center gap-3 mt-6 pt-4 border-t border-gray-300">
                <button
                    className="text-white bg-orange-600 px-12 py-1 disabled:bg-gray-500"
                    onClick={handleBack}
                >
                    Back
                </button>
                <button
                    className="text-white bg-orange-600 px-12 py-1 hover:bg-orange-700"
                    onClick={handleNext}
                    disabled={isLoading}
                >
                    {!isLoading ? "Next" : "Saving..."}
                </button>
            </div>
        </div>
    );
};

export default TestParts;
