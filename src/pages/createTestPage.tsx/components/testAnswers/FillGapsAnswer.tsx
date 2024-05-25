import { ChangeEvent, useState } from "react";
import { AnswerFormData, FillGapsQuestionItf } from "../../../../types/types";
import { generateArray } from "../../../../utils/array";

type FillGapsAnswerProps = {
    content: FillGapsQuestionItf;
    onProvideAnswer: (answerBody: AnswerFormData) => void;
};

const FillGapsAnswer = ({ content, onProvideAnswer }: FillGapsAnswerProps) => {
    const [gaps, setGaps] = useState<string[]>(
        content.answer || Array(content.num_gaps).fill("")
    );

    const handleFillGap = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            let updatedGaps = [...gaps];
            let index = parseInt(e.target.name.split("-")[1]) - 1;
            updatedGaps[index] = e.target.value;
            setGaps(updatedGaps);
            onProvideAnswer({ answer: updatedGaps });
        }
    };

    return (
        <div className="px-2 py-2 border border-orange-600">
            <div
                className=""
                dangerouslySetInnerHTML={{
                    __html: content.text.replaceAll("***", "___"),
                }}
            ></div>

            <div className="space-y-1 mt-2">
                {generateArray(content.num_gaps).map((num) => (
                    <div className="flex gap-3 items-end ps-2" key={num}>
                        <label htmlFor={`gap${num}`} className="text-nowrap">
                            Gap {num}:
                        </label>
                        <input
                            type="text"
                            name={`gap-${num}`}
                            value={gaps[num - 1]}
                            id={`gap-${num}`}
                            onChange={handleFillGap}
                            className="border border-gray-500 px-2 py-1 grow focus:border-orange-600 outline-none leading-5"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FillGapsAnswer;
