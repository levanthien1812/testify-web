import React, { useState } from "react";
import { FillGapsQuestionItf } from "../../../../types/types";
import { generateArray } from "../../../../utils/array";

const FillGapsAnswer: React.FC<{
    content: FillGapsQuestionItf;
}> = ({ content }) => {
    const [gaps, setGaps] = useState<string[]>([]);

    return (
        <div className="px-2 py-2 border border-orange-600">
            <p className="font-bold">{content.text}</p>

            <div className="space-y-1 mt-2">
                {generateArray(content.num_gaps).map((num) => (
                    <div className="flex gap-3 items-end ps-2">
                        <label htmlFor={`gap${num}`} className="text-nowrap">
                            Gap {num}:
                        </label>
                        <input
                            type="text"
                            name={`gap${num}`}
                            value={gaps[num - 1]}
                            id={`gap${num}`}
                            className="border border-gray-500 px-2 py-1 grow focus:border-orange-600 outline-none leading-5"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FillGapsAnswer;
