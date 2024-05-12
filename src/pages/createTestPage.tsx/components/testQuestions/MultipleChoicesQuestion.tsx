import React, { ChangeEvent, useState } from "react";
import { MultipleChoiceQuestionFormDataItf } from "../../../../types/types";
import { generateArray } from "../../../../utils/array";
import Option from "./Option";

const MulitpleChoiceQuestion: React.FC<{
    content: MultipleChoiceQuestionFormDataItf;
    onInputChange: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
}> = ({ content }) => {
    const [numOptions, setNumOptions] = useState<number>(2);

    return (
        <>
            <div className="flex flex-col items-start">
                <label htmlFor="content.text">Text: </label>
                <input
                    type="text"
                    name="content.text"
                    id="content.text"
                    min={0}
                    className="border border-gray-500 px-2 py-1 w-full focus:border-orange-600 outline-none leading-5"
                    value={content.text}
                    // onChange={handleInputChange}
                    required
                />
            </div>
            <div className="mt-2">
                <p>Options</p>
                <div className="space-y-1">
                    {generateArray(numOptions).map((num) => (
                        <Option
                            num={num}
                            key={num}
                            value={content.options[num - 1] || { text: "" }}
                            name={`option.${num}`}
                        />
                    ))}

                    <button
                        className="border border-gray-500 w-full py-0.5 bg-gray-200 hover:bg-gray-300"
                        onClick={() => setNumOptions((prev) => prev + 1)}
                    >
                        Add option
                    </button>
                </div>
            </div>
        </>
    );
};

export default MulitpleChoiceQuestion;
