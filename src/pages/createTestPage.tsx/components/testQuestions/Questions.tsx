import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { QuestionFormDataItf, QuestionItf, TestPartItf } from "../../../../types/types";
import Question from "./Question";
import Answer from "../testAnswers/Answer";

const Questions: React.FC<{
    part?: TestPartItf;
    testId?: string;
    questions: QuestionItf[] | QuestionFormDataItf[];
    onAfterUpdate: () => void;
    withAnswer?: boolean;
}> = ({ part, questions, onAfterUpdate, testId, withAnswer = false }) => {
    const [open, setOpen] = useState<boolean>(true);

    return (
        <>
            {part && (
                <div className="border border-gray-300 ">
                    <div
                        className="flex justify-between items-center px-4 py-2 bg-gray-300 cursor-pointer"
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        <p className="text-lg ">
                            <span className="uppercase">
                                Part {part.order}: {part.name}{" "}
                            </span>
                            <span className="text-gray-500">
                                {" "}
                                | Score: {part.score} | Questions:{" "}
                                {part.num_questions}
                            </span>
                        </p>
                        <FontAwesomeIcon
                            icon={faChevronRight}
                            className={`text-sm transition-all ${
                                open ? "rotate-90" : "rotate-0"
                            }`}
                        />
                    </div>
                    <div
                        className={`px-4 py-4 ${
                            !withAnswer ? "grid grid-cols-4 gap-2" : "space-y-2"
                        } `}
                    >
                        {questions &&
                            questions.length > 0 &&
                            questions.map(
                                (question, index) =>
                                    !withAnswer ? (
                                        <Question
                                            question={
                                                question as QuestionFormDataItf
                                            }
                                            testId={part.test_id}
                                            key={index}
                                            onAfterUpdate={onAfterUpdate}
                                        />
                                    )
                                    : (
                                    <Answer
                                        question={question as QuestionItf}
                                        key={question.content?.text}
                                        onAfterUpdate={onAfterUpdate}
                                    />
                                )
                            )}
                    </div>
                </div>
            )}
            {!part && (
                <div className="px-4 py-4 grid grid-cols-4 gap-2">
                    {questions.map((question, index) => (
                        <Question
                            question={question}
                            testId={testId!}
                            key={index}
                            onAfterUpdate={onAfterUpdate}
                        />
                    ))}{" "}
                </div>
            )}
        </>
    );
};

export default Questions;
