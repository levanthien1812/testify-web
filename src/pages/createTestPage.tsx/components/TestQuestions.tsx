import React, { useCallback, useMemo } from "react";
import { QuestionBodyItf, QuestionItf, TestItf } from "../../../types/types";
import { questionTypes, testLevels } from "../../../config/config";
import Questions from "./testQuestions/Questions";
import { validateQuestions } from "../../../services/test";
import { on } from "events";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import Button from "../../../components/elements/Button";

type SectionProps = {
    test: TestItf;
    onAfterUpdate: () => void;
    onBack: () => void;
    onNext: () => void;
};

const TestQuestions = ({
    test,
    onAfterUpdate,
    onBack,
    onNext,
}: SectionProps) => {
    const { mutate, isLoading } = useMutation({
        mutationFn: async () => {
            return await validateQuestions(test._id);
        },
        mutationKey: ["validateQuestions", { testId: test._id }],
        onSuccess: () => {
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
        mutate();
    };

    const getQuestions = useCallback(
        (partId?: string): (QuestionItf | null)[] => {
            if (partId) {
                const part = test.parts.find((part) => part._id === partId)!;

                return [
                    ...part.questions!,
                    ...[
                        ...Array(part.num_questions - part.questions!.length),
                    ].map(() => null),
                ];
            } else {
                return [
                    ...test.questions!,
                    ...[
                        ...Array(test.num_questions - test.questions!.length),
                    ].map(() => null),
                ];
            }
        },
        [test.parts, test.questions]
    );

    const isNextable = useMemo(() => {
        if (test.parts.length > 0) {
            const totalPartsQuestions = test.parts.reduce((prev, curr) => {
                return curr.questions ? prev + curr.questions?.length : prev;
            }, 0);

            return totalPartsQuestions === test.num_questions;
        } else {
            return test.questions!.length === test.num_questions;
        }
    }, [test.parts, test.questions]);

    return (
        <div className="px-20 py-12 shadow-2xl">
            <h2 className="text-center text-3xl">Test Questions</h2>

            <div className="space-y-3 mt-4">
                {test.parts.length > 0 &&
                    test.parts.map((part) => (
                        <Questions
                            part={part}
                            key={part.name}
                            questions={getQuestions(part._id)}
                            onAfterUpdate={onAfterUpdate}
                        />
                    ))}
                {test.parts.length === 0 && (
                    <Questions
                        onAfterUpdate={onAfterUpdate}
                        testId={test._id}
                        questions={getQuestions()}
                    />
                )}
            </div>

            <div className="flex justify-end items-center gap-3 mt-6 pt-4 border-t border-gray-300">
                <Button size="lg" onClick={handleBack}>
                    Back
                </Button>
                <Button size="lg" onClick={handleNext} disabled={!isNextable}>
                    {!isLoading ? "Next" : "Validating..."}
                </Button>
            </div>
        </div>
    );
};

export default TestQuestions;
