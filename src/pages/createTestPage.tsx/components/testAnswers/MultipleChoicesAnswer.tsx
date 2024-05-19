import React, { ChangeEvent, useEffect, useState } from "react";
import {
    AnswerFormData,
    FillGapsAnswerFormDataInf,
    MultipleChoiceQuestionItf,
    MultipleChoicesAnswerFormDataInf,
} from "../../../../types/types";
import FillGapsAnswer from "./FillGapsAnswer";

type MultipleChoicesAnswerProps = {
    content: MultipleChoiceQuestionItf;
    onProvideAnswer: (answerBody: AnswerFormData) => void;
};

const MultipleChoicesAnswer = ({
    content,
    onProvideAnswer,
}: MultipleChoicesAnswerProps) => {
    const [optionChosen, setOptionChosen] = useState<string>(
        content.answer
            ? content.answer.length > 0
                ? content.answer[0]
                : ""
            : ""
    );

    const handleChangeRadio = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setOptionChosen(e.target.value);
            onProvideAnswer({ answer: [e.target.value] });
        }
    };

    return (
        <div className="px-2 py-2 border border-orange-600">
            <p className="font-bold">{content.text}</p>

            <div className="space-y-1 mt-2">
                {content.options.map((option) => (
                    <div
                        className="flex gap-3 items-center ps-2 hover:bg-gray-200 cursor-pointer"
                        key={option._id}
                    >
                        <input
                            type="radio"
                            name={content._id}
                            value={option._id}
                            id={option._id}
                            onChange={handleChangeRadio}
                            checked={optionChosen === option._id}
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
