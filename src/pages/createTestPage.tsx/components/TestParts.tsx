import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { PartFormDataItf, TestItf } from "../../../types/types";
import { generateArray } from "../../../utils/array";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "react-query";
import { addParts } from "../../../services/test";
import { partSchema } from "../../../validations/test";
import { toast } from "react-toastify";

const PartItem: React.FC<{
    index: number;
    part: PartFormDataItf;
    setPart: (index: number, part: PartFormDataItf) => void;
}> = ({ index, part, setPart }) => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let name: string, value: string | number | Date;
        name = e.target.name;
        value = e.target.value;

        if (["score", "num_questions"].includes(name)) {
            value = parseInt(value);
        }

        setPart(index, { ...part, [name]: value });
    };

    return (
        <div className="border border-gray-300 ">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-300">
                <p className="text-lg">Part {index + 1}</p>
                <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
            </div>
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
                    <label htmlFor="num_questions" className="w-1/5 shrink-0">
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
        mutationFn: (parts: PartFormDataItf[]) => addParts(test._id, parts),
        mutationKey: ["add-parts", { body: test.parts }],
        onSuccess: (data) => {
            setTest(data.test);
            onNext();
        },
    });

    const handleBack = () => {
        onBack();
    };

    const handleNext = () => {
        const { error } = partSchema.validate(test.parts);
        if (!error) {
            mutate(test.parts);
            onNext();
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
                {numParts > 1 &&
                    test.parts.map((part, index) => (
                        <PartItem
                            key={index}
                            index={index}
                            part={part}
                            setPart={(index: number, part: PartFormDataItf) => {
                                const updatedParts = [...test.parts];
                                updatedParts[index] = part;
                                setTest({ ...test, parts: updatedParts });
                            }}
                        />
                    ))}
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
                    // disabled={isLoading}
                >
                    {/* {!isLoading ? "Next" : "Saving..."} */}
                    Next
                </button>
            </div>
        </div>
    );
};

export default TestParts;
