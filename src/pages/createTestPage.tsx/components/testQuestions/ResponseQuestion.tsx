import React, { ChangeEvent, useEffect, useState } from "react";
import { ResponseQuestionBodyItf } from "../../../../types/types";
import TextEditor from "../../../../components/richTextEditor/TiptapEditor";
import { useCurrentEditor } from "@tiptap/react";
import Input from "../../../../components/elements/Input";

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
                <label htmlFor="min_length">Minimum length of response: </label>
                <Input
                    type="number"
                    name="min_length"
                    id="min_length"
                    min={1}
                    className="w-full"
                    value={content.min_length}
                    onChange={handleInputChange}
                />
            </div>
            <div className="flex flex-col items-start mt-2">
                <label htmlFor="max_length">Maximum length: </label>
                <Input
                    type="number"
                    name="max_length"
                    id="max_length"
                    min={1}
                    className="w-full"
                    value={content.max_length}
                    onChange={handleInputChange}
                />
            </div>
        </>
    );
};

export default ResponseQuestion;
