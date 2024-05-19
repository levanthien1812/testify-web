import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { QuestionItf, TestItf, TestPartItf } from "../../../../types/types";
import Question from "./Question";
import Answer from "../testAnswers/Answer";

const QuestionsByPart: React.FC<{
    part: TestPartItf;
    questions: QuestionItf[] | undefined;
    onAfterUpdate: () => void;
    withAnswer?: boolean;
}> = ({ part, questions, onAfterUpdate, withAnswer = false }) => {
    const [open, setOpen] = useState<boolean>(true);

    return (
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
            <div
                className={`px-4 py-4 ${
                    !withAnswer ? "grid grid-cols-4 gap-2" : "space-y-2"
                } `}
            >
                {questions &&
                    questions.length > 0 &&
                    questions.map((question) =>
                        !withAnswer ? (
                            <Question
                                question={question}
                                key={question._id}
                                onAfterUpdate={onAfterUpdate}
                            />
                        ) : (
                            <Answer
                                question={question}
                                key={question._id}
                                onAfterUpdate={onAfterUpdate}
                            />
                        )
                    )}
            </div>
        </div>
    );
};

export default QuestionsByPart;
