import { ChangeEvent, useEffect, useState } from "react";
import { AnswerFormData, FillGapsQuestionItf, QuestionItf } from "../../../types/types";

type FillGapsAnswerProps = {
    question: QuestionItf;
};

const FillGapsAnswer = ({ question }: FillGapsAnswerProps) => {
    const [gaps, setGaps] = useState<string[]>([]);

    return (
        <>
            <div
                className=""
                dangerouslySetInnerHTML={{
                    __html: question.content.text.replaceAll("***", "___"),
                }}
            ></div>

            <div className="space-y-1 mt-2">
                {[...Array(question.content)].map((num, index) => (
                    <div className="flex gap-3 items-end ps-2" key={index + 1}>
                        <label
                            htmlFor={`gap${index + 1}`}
                            className="text-nowrap"
                        >
                            Gap {index + 1}:
                        </label>
                        <input
                            type="text"
                            name={`gap-${index + 1}`}
                            value={gaps[index]}
                            id={`gap-${index + 1}`}
                            className="border border-gray-500 px-2 py-1 grow focus:border-orange-600 outline-none leading-5"
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export default FillGapsAnswer;
