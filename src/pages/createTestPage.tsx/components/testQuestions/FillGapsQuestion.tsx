import React, { ChangeEvent, useEffect, useState } from "react";
import { FillGapsQuestionFormDataItf } from "../../../../types/types";
import TextEditor from "../../../richTextEditor/TiptapEditor";
import { useCurrentEditor } from "@tiptap/react";

const FillGapsQuestion: React.FC<{
    content: FillGapsQuestionFormDataItf;
    onContentChange: (content: FillGapsQuestionFormDataItf) => void;
}> = ({ content, onContentChange }) => {
    const [mcqContent, setMcqContent] =
        useState<FillGapsQuestionFormDataItf>(content);
    const [text, setText] = useState<string>(content.text);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let name = e.target.name;
        let value = e.target.value;

        setMcqContent({ ...mcqContent, [name]: value });
    };

    useEffect(() => {
        onContentChange({ ...mcqContent, text });
    }, [mcqContent, text]);

    return (
        <>
            <div className="flex flex-col items-start">
                <label htmlFor="num_gaps">Number of gaps: </label>
                <input
                    type="number"
                    name="num_gaps"
                    id="num_gaps"
                    min={1}
                    className="border border-gray-500 px-2 py-1 w-full focus:border-orange-600 outline-none leading-5"
                    value={content.num_gaps}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="flex flex-col mt-2">
                <label htmlFor="text">Text: </label>
                <TextEditor
                    content={text}
                    setContent={setText}
                    withInsertGapButton={true}
                />
                <p className="text-right text-sm italic mt-2">
                    Place the cursor somewhere in the text and click Insert Gap
                    button{" "}
                </p>
            </div>
        </>
    );
};

export default FillGapsQuestion;
