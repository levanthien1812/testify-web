import React from "react";
import { TestItf } from "../../../types/types";
import QuestionsByPart from "./testQuestions/QuestionsByPart";
import Answer from "./testAnswers/Answer";

const TestAnswers: React.FC<{
    test: TestItf;
    setTest: React.Dispatch<React.SetStateAction<TestItf | null>>;
    onBack: () => void;
    onNext: () => void;
}> = ({ test, setTest, onBack, onNext }) => {
    const handleBack = () => {
        onBack();
    };

    const handleNext = () => {
        onNext();
    };

    const handleUpdate = () => {
        // refetch();
    };

    return (
        <div className="px-20 py-12 shadow-2xl">
            <h2 className="text-center text-3xl">Test Answers</h2>

            <div className="space-y-3 mt-4">
                {test.parts.length > 0 &&
                    test.parts.map((part, index) => (
                        <QuestionsByPart
                            part={part}
                            key={part.name}
                            questions={test.questions?.filter(
                                (question) =>
                                    question.part_number === part.order
                            )}
                            onAfterUpdate={handleUpdate}
                            withAnswer={true}
                        />
                    ))}
                {test.parts.length === 0 && (
                    <div className="px-4 py-4 grid grid-cols-4 gap-2">
                        {test.questions?.map((question) => (
                            <Answer
                                question={question}
                                key={question._id}
                                onAfterUpdate={handleUpdate}
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
                    disabled={
                        !test.questions?.every((question) => question.content)
                    }
                >
                    {/* {!isLoading ? "Next" : "Saving..."} */}
                    Next
                </button>
            </div>
        </div>
    );
};

export default TestAnswers;
