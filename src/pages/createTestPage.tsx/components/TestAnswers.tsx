import React, { useCallback } from "react";
import { QuestionItf, TestItf } from "../../../types/types";
import Answer from "./testAnswers/Answer";
import Questions from "./testQuestions/Questions";

type SectionProps = {
    test: TestItf;
    onAfterUpdate: () => void;
    onBack: () => void;
    onNext: () => void;
};

const TestAnswers = ({ test, onBack, onNext, onAfterUpdate }: SectionProps) => {
    const handleBack = () => {
        onBack();
    };

    const handleNext = () => {
        onNext();
    };

    return (
        <div className="px-20 py-12 shadow-2xl">
            <h2 className="text-center text-3xl">Test Answers</h2>
            <p className="text-center">
                You can skip this section and provide answers later
            </p>

            <div className="space-y-3 mt-4">
                {test.parts.length > 0 &&
                    test.parts.map((part) => (
                        <Questions
                            part={part}
                            key={part.name}
                            questions={part.questions!}
                            onAfterUpdate={onAfterUpdate}
                            withAnswer={true}
                        />
                    ))}
                {test.parts.length === 0 && (
                    <div className={`px-4 py-4 space-y-2`}>
                        {test.questions!.map((question) => (
                            <Answer
                                question={question}
                                key={question._id}
                                onAfterUpdate={onAfterUpdate}
                            />
                        ))}
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
                    className="text-white bg-orange-600 px-12 py-1 hover:bg-orange-700 disabled:bg-gray-500"
                    onClick={handleNext}
                    // disabled={
                    //     !test.questions?.every((question) => question.content)
                    // }
                >
                    {/* {!isLoading ? "Next" : "Saving..."} */}
                    Next
                </button>
            </div>
        </div>
    );
};

export default TestAnswers;
