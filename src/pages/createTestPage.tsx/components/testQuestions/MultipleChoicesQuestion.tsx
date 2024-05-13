import React, { ChangeEvent, useEffect, useState } from "react";
import { MultipleChoiceQuestionFormDataItf } from "../../../../types/types";
import { generateArray } from "../../../../utils/array";
import Option from "./Option";

const MulitpleChoiceQuestion: React.FC<{
    content: MultipleChoiceQuestionFormDataItf;
    onContentChange: (content: MultipleChoiceQuestionFormDataItf) => void;
}> = ({ content, onContentChange }) => {
    const [mcqContent, setMcqContent] =
        useState<MultipleChoiceQuestionFormDataItf>(content);

    const manipulateOptions = (action: (array: { text: string }[]) => void) => {
        const updatedContent = { ...mcqContent };
        const updatedOptions = updatedContent.options;
        action(updatedOptions);
        updatedContent.options = updatedOptions;
        setMcqContent(updatedContent);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let name = e.target.name;
        let value = e.target.value;

        if (name.includes("options")) {
            const index = name.split(".")[1];

            manipulateOptions((arr) => (arr[parseInt(index)].text = value));
        } else {
            setMcqContent({ ...mcqContent, [name]: value });
        }
    };

    const handleAddOption = () => {
        manipulateOptions((arr) => arr.push({ text: "" }));
    };

    const handleDeleteOption = (index: number) => {
        manipulateOptions((arr) => arr.splice(index, 1));
    };

    useEffect(() => {
        onContentChange(mcqContent);
    }, [mcqContent]);

    return (
        <>
            <div className="flex flex-col items-start">
                <label htmlFor="text">Text: </label>
                <input
                    type="text"
                    name="text"
                    id="text"
                    min={0}
                    className="border border-gray-500 px-2 py-1 w-full focus:border-orange-600 outline-none leading-5"
                    value={mcqContent.text}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="mt-2">
                <p>Options</p>
                <div className="space-y-1">
                    {mcqContent.options.map((option, index) => (
                        <Option
                            index={index}
                            key={index}
                            value={option}
                            name={`options.${index}`}
                            onInputChange={handleInputChange}
                            onDelete={handleDeleteOption}
                        />
                    ))}

                    <button
                        className="border border-gray-500 w-full py-0.5 bg-gray-200 hover:bg-gray-300"
                        onClick={handleAddOption}
                    >
                        Add option
                    </button>
                </div>
            </div>
        </>
    );
};

export default MulitpleChoiceQuestion;
