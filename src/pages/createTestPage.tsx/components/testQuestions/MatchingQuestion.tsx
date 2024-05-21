import React, { ChangeEvent, useEffect, useState } from "react";
import { MatchingQuestionFormDataItf } from "../../../../types/types";
import { generateArray } from "../../../../utils/array";
import Option from "./Option";
import TextEditor from "../../../richTextEditor/TiptapEditor";

const MatchingQuestion: React.FC<{
    content: MatchingQuestionFormDataItf;
    onContentChange: (content: MatchingQuestionFormDataItf) => void;
}> = ({ content, onContentChange }) => {
    const [mcqContent, setMcqContent] =
        useState<MatchingQuestionFormDataItf>(content);
    const [text, setText] = useState<string>(content.text);

    const manipulateArray = (
        arrayName: "left_items" | "right_items",
        action: (array: { text: string }[]) => void
    ) => {
        const updatedContent = { ...mcqContent };
        const updatedArray = updatedContent[arrayName];
        action(updatedArray);
        updatedContent[arrayName] = updatedArray;
        setMcqContent(updatedContent);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let name = e.target.name;
        let value = e.target.value;

        if (name.includes("items")) {
            const arrayName = name.split(".")[0] as
                | "left_items"
                | "right_items";
            const index = name.split(".")[1];

            manipulateArray(
                arrayName,
                (arr) => (arr[parseInt(index)].text = value)
            );
        } else {
            setMcqContent({ ...mcqContent, [name]: value });
        }
    };

    const handleAddOption = () => {
        manipulateArray("left_items", (arr) => arr.push({ text: "" }));
        manipulateArray("right_items", (arr) => arr.push({ text: "" }));
    };

    const handleDeleteOption = (index: number) => {
        manipulateArray("left_items", (arr) => arr.splice(index, 1));
        manipulateArray("right_items", (arr) => arr.splice(index, 1));
    };

    useEffect(() => {
        onContentChange({...mcqContent, text});
    }, [mcqContent, text]);

    return (
        <>
            <div className="flex flex-col">
                <label htmlFor="text">Text: </label>
                <TextEditor content={text} setContent={setText} />
            </div>
            <div className="mt-2">
                <p>Left part:</p>
                <div className="space-y-1">
                    {content.left_items.map((item, index) => (
                        <Option
                            index={index}
                            key={index}
                            value={item}
                            name={`left_items.${index}`}
                            onDelete={handleDeleteOption}
                            onInputChange={handleInputChange}
                        />
                    ))}

                    <button
                        className="border border-gray-500 w-full py-0.5 bg-gray-200 hover:bg-gray-300"
                        onClick={handleAddOption}
                    >
                        Add item
                    </button>
                </div>
            </div>
            <div className="mt-2">
                <p>Right part:</p>
                <div className="space-y-1">
                    {content.right_items.map((item, index) => (
                        <Option
                            index={index}
                            key={index}
                            value={item}
                            name={`right_items.${index}`}
                            onDelete={handleDeleteOption}
                            onInputChange={handleInputChange}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default MatchingQuestion;
