import React, { useCallback, useMemo } from "react";
import { QuestionFormDataItf, TestItf } from "../../../types/types";
import { questionTypes, testLevels } from "../../../config/config";
import Questions from "./testQuestions/Questions";

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
    const handleBack = () => {
        onBack();
    };

    const handleNext = () => {
        onNext();
    };

    const getQuestions = useCallback(
        (partId?: string): QuestionFormDataItf[] => {
            if (partId) {
                const part = test.parts.find((part) => part._id === partId)!;

                return [
                    ...part.questions!,
                    ...[
                        ...Array(part.num_questions - part.questions!.length),
                    ].map((item, index) => {
                        return {
                            score: 0,
                            level: testLevels.NONE,
                            type: questionTypes.MULITPLE_CHOICES,
                            content: null,
                            order: index + 1,
                            part_id: part._id,
                        };
                    }),
                ];
            } else {
                return [
                    ...test.questions!,
                    ...[
                        ...Array(test.num_questions - test.questions!.length),
                    ].map((item, index) => {
                        return {
                            score: 0,
                            level: testLevels.NONE,
                            type: questionTypes.MULITPLE_CHOICES,
                            content: null,
                            order: index + 1,
                        };
                    }),
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
                <button
                    className="text-white bg-orange-600 px-12 py-1 disabled:bg-gray-500"
                    onClick={handleBack}
                >
                    Back
                </button>
                <button
                    className="text-white bg-orange-600 px-12 py-1 hover:bg-orange-700 disabled:bg-gray-500"
                    onClick={handleNext}
                    disabled={!isNextable}
                >
                    {/* {!isLoading ? "Next" : "Saving..."} */}
                    Next
                </button>
            </div>
        </div>
    );
};

export default TestQuestions;
