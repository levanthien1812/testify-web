import React, { ChangeEvent, useEffect, useState } from "react";
import { MatchingQuestionBodyItf } from "../../../../types/types";
import Option from "./Option";
import TextEditor from "../../../richTextEditor/TiptapEditor";
import { toast } from "react-toastify";
import Button from "../../../authPage/components/Button";

const MatchingQuestion: React.FC<{
    content: MatchingQuestionBodyItf;
    onContentChange: (content: MatchingQuestionBodyItf) => void;
}> = ({ content, onContentChange }) => {
    const [mqContent, setMqContent] =
        useState<MatchingQuestionBodyItf>(content);
    const [text, setText] = useState<string>(content.text);

    const manipulateArray = (
        arrayName: "left_items" | "right_items",
        action: (array: { text: string }[]) => void
    ) => {
        const updatedContent = { ...mqContent };
        const updatedArray = updatedContent[arrayName];
        action(updatedArray);
        updatedContent[arrayName] = updatedArray;
        setMqContent(updatedContent);
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
            setMqContent({ ...mqContent, [name]: value });
        }
    };

    const handleAddOption = () => {
        if (mqContent.left_items.length >= 10) {
            toast.warning("You can't add more than 10 options");
            return;
        }
        manipulateArray("left_items", (arr) => arr.push({ text: "" }));
        manipulateArray("right_items", (arr) => arr.push({ text: "" }));
    };

    const handleDeleteOption = (index: number) => {
        if (mqContent.left_items.length <= 2) {
            toast.warning("You can't delete more than 2 options");
            return;
        }
        manipulateArray("left_items", (arr) => arr.splice(index, 1));
        manipulateArray("right_items", (arr) => arr.splice(index, 1));
    };

    useEffect(() => {
        onContentChange({ ...mqContent, text });
    }, [mqContent, text]);

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

                    <Button
                        primary={false}
                        className="w-full"
                        onClick={handleAddOption}
                    >
                        Add item
                    </Button>
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
