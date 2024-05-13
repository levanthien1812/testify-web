import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { QuestionItf, TestItf, TestPartItf } from "../../../types/types";
import Question from "./testQuestions/Question";
import { getTest } from "../../../services/test";
import { useQuery } from "react-query";

const QuestionsByPart: React.FC<{
    part: TestPartItf;
    questions: QuestionItf[] | undefined;
    onAfterUpdate: () => void;
}> = ({ part, questions, onAfterUpdate }) => {
    const [open, setOpen] = useState<boolean>(true);

    return (
        <div className="border border-gray-300 ">
            <div
                className="flex justify-between items-center px-4 py-2 bg-gray-300 cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
            >
                <p className="text-lg">
                    Part {part.order}: {part.name}{" "}
                    <span className="text-gray-500">
                        {" "}
                        | Score: {part.score} | Questions: {part.num_questions}
                    </span>
                </p>
                <FontAwesomeIcon
                    icon={faChevronRight}
                    className={`text-sm transition-all ${
                        open ? "rotate-90" : "rotate-0"
                    }`}
                />
            </div>
            <div className="px-4 py-4 grid grid-cols-4 gap-2">
                {questions &&
                    questions.length > 0 &&
                    questions.map((question) => (
                        <Question
                            question={question}
                            key={question._id}
                            onAfterUpdate={onAfterUpdate}
                        />
                    ))}
            </div>
        </div>
    );
};

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

    const handleBack = () => {};

    const handleNext = () => {};

    const handleUpdate = () => {
        refetch();
    };

    return (
        <div className="px-20 py-12 shadow-2xl">
            <h2 className="text-center text-3xl">Test Questions</h2>

            <div className="space-y-3 mt-4">
                {test.parts.map((part, index) => (
                    <QuestionsByPart
                        part={part}
                        key={part.name}
                        questions={test.questions?.filter(
                            (question) => question.part_number === part.order
                        )}
                        onAfterUpdate={handleUpdate}
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

export default TestQuestions;
