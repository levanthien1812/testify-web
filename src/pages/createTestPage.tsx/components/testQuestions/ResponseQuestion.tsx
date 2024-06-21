import React, { ChangeEvent, useEffect, useState } from "react";
import { ResponseQuestionBodyItf } from "../../../../types/types";
import TextEditor from "../../../richTextEditor/TiptapEditor";
import { useCurrentEditor } from "@tiptap/react";

const ResponseQuestion: React.FC<{
    content: ResponseQuestionBodyItf;
    onContentChange: (content: ResponseQuestionBodyItf) => void;
}> = ({ content, onContentChange }) => {
    const [rqContent, setRqContent] =
        useState<ResponseQuestionBodyItf>(content);
    const [text, setText] = useState<string>(content.text);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let name = e.target.name;
        let value: string | number = e.target.value;

        if (e.target.type === "number") {
            value = parseInt(value);
        }

        setRqContent({ ...rqContent, [name]: value });
    };

    useEffect(() => {
        onContentChange({ ...rqContent, text });
    }, [rqContent, text]);

    return (
        <>
            <div className="flex flex-col mt-2">
                <label htmlFor="text">Text: </label>
                <TextEditor content={text} setContent={setText} />
            </div>
            <div className="flex flex-col items-start mt-2">
                <label htmlFor="minLength">Minimum length of response: </label>
                <input
                    type="number"
                    name="minLength"
                    id="minLength"
                    min={1}
                    className="border border-gray-500 px-2 py-1 w-full focus:border-orange-600 outline-none leading-5"
                    value={content.minLength}
                    onChange={handleInputChange}
                />
            </div>
            <div className="flex flex-col items-start mt-2">
                <label htmlFor="maxLength">Maximum length: </label>
                <input
                    type="number"
                    name="maxLength"
                    id="maxLength"
                    min={1}
                    className="border border-gray-500 px-2 py-1 w-full focus:border-orange-600 outline-none leading-5"
                    value={content.maxLength}
                    onChange={handleInputChange}
                />
            </div>
        </>
    );
};

export default ResponseQuestion;
