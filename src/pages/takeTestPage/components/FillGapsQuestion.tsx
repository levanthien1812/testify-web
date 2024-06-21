import { ChangeEvent, useEffect, useState } from "react";
import { AnswerBody, FillGapsQuestionItf } from "../../../types/types";
import { generateArray } from "../../../utils/array";

type FillGapsQuestionProps = {
    content: FillGapsQuestionItf;
    onProvideAnswer: (answer: string[]) => void;
};

const FillGapsQuestion = ({
    content,
    onProvideAnswer,
}: FillGapsQuestionProps) => {
    const [gaps, setGaps] = useState<string[]>([]);

    const handleFillGap = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            let updatedGaps = [...gaps];
            let index = parseInt(e.target.name.split("-")[1]) - 1;
            updatedGaps[index] = e.target.value;
            setGaps(updatedGaps);
            onProvideAnswer(updatedGaps);
        }
    };

    return (
        <>
            <div
                className=""
                dangerouslySetInnerHTML={{
                    __html: content.text.replaceAll("***", "___"),
                }}
            ></div>

            <div className="space-y-1 mt-2">
                {[...Array(content.num_gaps)].map((num, index) => (
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
                            onChange={handleFillGap}
                            className="border border-gray-500 px-2 py-1 grow focus:border-orange-600 outline-none leading-5"
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export default FillGapsQuestion;
