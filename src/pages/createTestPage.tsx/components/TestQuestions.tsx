import React from "react";
import { TestItf } from "../../../types/types";
import { getTest } from "../../../services/test";
import { useQuery } from "react-query";
import QuestionsByPart from "./testQuestions/QuestionsByPart";
import Question from "./testQuestions/Question";

const TestQuestions: React.FC<{
    test: TestItf;
    setTest: React.Dispatch<React.SetStateAction<TestItf | null>>;
    onBack: () => void;
    onNext: () => void;
}> = ({ test, setTest, onBack, onNext }) => {
    const { data, isFetching, refetch } = useQuery({
        queryFn: async () => {
            const res = await getTest(test._id);
            return res.test;
        },
        onSuccess(data) {
            setTest(data);
        },
        queryKey: [`get-test`, { testId: test._id }],
        enabled: false,
    });

    const handleBack = () => {
        onBack();
    };

    const handleNext = () => {
        onNext();
    };

    const handleUpdate = () => {
        refetch();
    };

    return (
        <div className="px-20 py-12 shadow-2xl">
            <h2 className="text-center text-3xl">Test Questions</h2>

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
                        />
                    ))}
                {test.parts.length === 0 && (
                    <div className="px-4 py-4 grid grid-cols-4 gap-2">
                        {test.questions?.map((question) => (
                            <Question
                                question={question}
                                key={question._id}
                                onAfterUpdate={handleUpdate}
                            />
                        ))}{" "}
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

export default TestQuestions;
