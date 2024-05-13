import React, { ChangeEvent, useEffect, useState } from "react";
import { FillGapsQuestionFormDataItf } from "../../../../types/types";

const FillGapsQuestion: React.FC<{
    content: FillGapsQuestionFormDataItf;
    onContentChange: (content: FillGapsQuestionFormDataItf) => void;
}> = ({ content, onContentChange }) => {
    const [mcqContent, setMcqContent] =
        useState<FillGapsQuestionFormDataItf>(content);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let name = e.target.name;
        let value = e.target.value;

        setMcqContent({ ...mcqContent, [name]: value });
    };

    useEffect(() => {
        onContentChange(mcqContent);
    }, [mcqContent]);

    return (
        <>
            <div className="flex flex-col items-start">
                <label htmlFor="content.text">Text: </label>
                <input
                    type="text"
                    name="text"
                    id="text"
                    min={0}
                    className="border border-gray-500 px-2 py-1 w-full focus:border-orange-600 outline-none leading-5 placeholder:italic"
                    value={content.text}
                    onChange={handleInputChange}
                    required
                    placeholder="Include *** as mark of gaps"
                />
            </div>
        </>
    );
};

export default FillGapsQuestion;