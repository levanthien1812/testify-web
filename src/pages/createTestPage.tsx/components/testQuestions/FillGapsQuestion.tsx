import React, { ChangeEvent } from "react";
import { FillGapsQuestionFormDataItf } from "../../../../types/types";

const FillGapsQuestion: React.FC<{
    content: FillGapsQuestionFormDataItf;
    onInputChange: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
}> = ({ content }) => {
    return (
        <>
            <div className="flex flex-col items-start">
                <label htmlFor="content.text">Text: </label>
                <input
                    type="text"
                    name="content.text"
                    id="content.text"
                    min={0}
                    className="border border-gray-500 px-2 py-1 w-full focus:border-orange-600 outline-none leading-5 placeholder:italic"
                    value={content.text}
                    // onChange={handleInputChange}
                    required
                    placeholder="Include *** as mark of gaps"
                />
            </div>
        </>
    );
};

export default FillGapsQuestion;
