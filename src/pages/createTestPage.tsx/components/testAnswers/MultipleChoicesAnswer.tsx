import React from "react";
import { MultipleChoiceQuestionItf } from "../../../../types/types";

const MultipleChoicesAnswer: React.FC<{
    content: MultipleChoiceQuestionItf;
}> = ({ content }) => {
    return (
        <div className="px-2 py-2 border border-orange-600">
            <p className="font-bold">{content.text}</p>

            <div className="space-y-1 mt-2">
                {content.options.map((option) => (
                    <div className="flex gap-3 items-center ps-2 hover:bg-gray-200 cursor-pointer">
                        <input
                            type="radio"
                            name={content._id}
                            value={option.text}
                            id={option._id}
                        />
                        <label htmlFor={option._id} className="grow">
                            {option.text}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultipleChoicesAnswer;
