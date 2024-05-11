import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { QuestionItf, TestItf, TestPartItf } from "../../../types/types";
import Modal from "../../../components/modals/Modal";

const Question: React.FC<{ question: QuestionItf }> = ({ question }) => {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <>
            <div
                className="bg-orange-100 p-2 text-center cursor-pointer hover:bg-orange-200"
                onClick={() => setOpen(true)}
            >
                Question {question.order}
            </div>
            {open && (
                <Modal
                    title={`Question ${question.order}`}
                    onClose={() => setOpen(false)}
                >
                    <div>{question._id}</div>
                </Modal>
            )}
        </>
    );
};

const QuestionsByPart: React.FC<{
    part: TestPartItf;
    questions: QuestionItf[] | undefined;
}> = ({ part, questions }) => {
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
                        <Question question={question} key={question._id} />
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
    const handleBack = () => {};

    const handleNext = () => {};
    return (
        <div className="px-20 py-12 shadow-2xl">
            <h2 className="text-center text-3xl">Test Questions</h2>

            <div className="space-y-3 mt-4">
                {test.parts.map((part, index) => (
                    <QuestionsByPart
                        part={part}
                        questions={test.questions?.filter(
                            (question) => question.part_number === part.order
                        )}
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
