import React, { ChangeEvent, useEffect, useState } from "react";
import { MultipleChoiceQuestionFormDataItf } from "../../../../types/types";
import Option from "./Option";
import TextEditor from "../../../richTextEditor/TiptapEditor";
import { toast } from "react-toastify";

const MulitpleChoiceQuestion: React.FC<{
    content: MultipleChoiceQuestionFormDataItf;
    onContentChange: (content: MultipleChoiceQuestionFormDataItf) => void;
}> = ({ content, onContentChange }) => {
    const [mcqContent, setMcqContent] =
        useState<MultipleChoiceQuestionFormDataItf>(content);
    const [text, setText] = useState<string>(content.text);

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
        if (mcqContent.options.length >= 10) {
            toast.warning("Maximum 10 options are allowed");
            return;
        }
        manipulateOptions((arr) => arr.push({ text: "" }));
    };

    const handleDeleteOption = (index: number) => {
        if (mcqContent.options.length <= 2) {
            toast.warning("Minimum 2 options are required");
            return;
        }
        manipulateOptions((arr) => arr.splice(index, 1));
    };

    useEffect(() => {
        onContentChange({ ...mcqContent, text });
    }, [mcqContent, text]);

    return (
        <>
            <div className="flex flex-col">
                <label htmlFor="text">Text: </label>
                <TextEditor content={text} setContent={setText} />
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
