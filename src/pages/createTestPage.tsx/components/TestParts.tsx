import React, { useCallback } from "react";
import { PartFormDataItf, TestItf } from "../../../types/types";
import { useMutation } from "react-query";
import { validateParts } from "../../../services/test";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import Part from "./testParts/Part";

type SectionProps = {
    test: TestItf;
    onAfterUpdate: () => void;
    onBack: () => void;
    onNext: () => void;
};

const TestParts = ({ test, onAfterUpdate, onBack, onNext }: SectionProps) => {
    const { mutate, isLoading } = useMutation({
        mutationFn: async () => await validateParts(test._id),
        mutationKey: ["validate-parts", { testId: test._id }],
        onSuccess: (data) => {
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
        if (test.num_parts === 1) {
            onNext();
            return;
        }

        mutate();
    };

    const handleAfterUpdate = async () => {
        onAfterUpdate();
    };

    const getPart = useCallback(
        (index: number): PartFormDataItf => {
            const partIndex = test.parts.findIndex(
                (item) => item.order === index + 1
            );
            if (partIndex >= 0) {
                return test.parts[partIndex];
            } else {
                return {
                    order: index + 1,
                    name: "",
                    description: "",
                    num_questions: 0,
                    score: 0,
                };
            }
        },
        [test.parts]
    );

    return (
        <div className="px-20 py-12 shadow-2xl">
            <h2 className="text-center text-3xl">Test Parts Information</h2>

            <div className="space-y-3 mt-4">
                <div className="flex gap-4">
                    <p>Total score: {test.max_score}</p>
                    <p>Total questions: {test.num_questions}</p>
                </div>
                {test.num_parts > 1 &&
                    [...Array(test.num_parts)].map((item, index) => (
                        <Part
                            key={index}
                            part={getPart(index)}
                            testId={test._id}
                            onAfterUpdate={handleAfterUpdate}
                        />
                    ))}
                {test.num_parts === 1 && (
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
