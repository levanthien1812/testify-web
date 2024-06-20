import React from "react";
import { TestItf } from "../../../types/types";
import Answer from "./Answer";

type TestQuestionsAndAnswersProps = {
    test: TestItf;
};

const TestQuestionsAndAnswers = ({ test }: TestQuestionsAndAnswersProps) => {
    return (
        <div className="mt-4">
            {test.num_parts > 1 &&
                test.parts.map((part) => {
                    return (
                        <div key={part._id} className="">
                            <div className="text-lg bg-gray-200 px-4 py-1">
                                <span className="underline">
                                    Part {part.order}:
                                </span>{" "}
                                <span className="uppercase"> {part.name}</span>
                            </div>

                            <div>
                                {part.questions &&
                                    part.questions.map((question) => (
                                        <Answer
                                            question={question}
                                            key={question._id}
                                        />
                                    ))}
                            </div>
                        </div>
                    );
                })}
            {test.num_parts <= 1 &&
                test.questions!.map((question) => (
                    <Answer question={question} key={question._id} />
                ))}
        </div>
    );
};

export default TestQuestionsAndAnswers;
