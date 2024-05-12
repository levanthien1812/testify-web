import React, { ChangeEvent, useState } from "react";
import { MatchingQuestionFormDataItf } from "../../../../types/types";
import { generateArray } from "../../../../utils/array";
import Option from "./Option";

const MatchingQuestion: React.FC<{
    content: MatchingQuestionFormDataItf;
    onInputChange: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
}> = ({ content }) => {
    const [numOptions, setNumOptions] = useState<number>(2);

    console.log(content);

    return (
        <>
            <div className="flex flex-col items-start">
                <label htmlFor="content.text">Text: </label>
                <input
                    type="text"
                    name="content.text"
                    id="content.text"
                    min={0}
                    className="border border-gray-500 px-2 py-1 w-full focus:border-orange-600 outline-none leading-5 placeholder:italic"
                    value={content.text}
                    // onChange={handleInputChange}
                    required
                />
            </div>
            <div className="mt-2">
                <p>Left part:</p>
                <div className="space-y-1">
                    {generateArray(numOptions).map((num) => (
                        <Option
                            num={num}
                            key={num}
                            value={content.left_items[num - 1] || { text: "" }}
                            name={`left.${num}`}
                        />
                    ))}

                    <button
                        className="border border-gray-500 w-full py-0.5 bg-gray-200 hover:bg-gray-300"
                        onClick={() => setNumOptions((prev) => prev + 1)}
                    >
                        Add item
                    </button>
                </div>
            </div>
            <div className="mt-2">
                <p>Right part:</p>
                <div className="space-y-1">
                    {generateArray(numOptions).map((num) => (
                        <Option
                            num={num}
                            key={num}
                            value={content.right_items[num - 1] || { text: "" }}
                            name={`right.${num}`}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default MatchingQuestion;
