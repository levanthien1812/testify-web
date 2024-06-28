import React, { ChangeEvent, useEffect, useState } from "react";
import { MultipleChoiceQuestionBodyItf } from "../../../../types/types";
import Option from "./Option";
import TextEditor from "../../../../components/richTextEditor/TiptapEditor";
import { toast } from "react-toastify";
import Button from "../../../../components/elements/Button";
import ImagesChoser from "../../../../components/elements/ImagesChoser";

const MulitpleChoiceQuestion: React.FC<{
    content: MultipleChoiceQuestionBodyItf;
    onContentChange: (content: MultipleChoiceQuestionBodyItf) => void;
}> = ({ content, onContentChange }) => {
    const [mcqContent, setMcqContent] =
        useState<MultipleChoiceQuestionBodyItf>(content);

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

    const handleImageChange = (images: FileList | null) => {
        setMcqContent({ ...mcqContent, images });
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
        onContentChange(mcqContent);
    }, [mcqContent]);

    return (
        <>
            <div className="flex flex-col">
                <label htmlFor="text">Text: </label>
                <TextEditor
                    content={mcqContent.text}
                    setContent={(text) =>
                        setMcqContent({ ...mcqContent, text })
                    }
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

                    <Button
                        primary={false}
                        className="w-full"
                        onClick={handleAddOption}
                    >
                        Add option
                    </Button>
                </div>

                <div className="mt-4">
                    <label htmlFor="images">Images</label>
                    <ImagesChoser
                        images={mcqContent.images || null}
                        setImages={(images: FileList | null) =>
                            handleImageChange(images)
                        }
                    />
                </div>
            </div>
        </>
    );
};

export default MulitpleChoiceQuestion;
