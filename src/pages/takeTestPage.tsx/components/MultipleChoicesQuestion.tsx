import { ChangeEvent, useEffect, useState } from "react";
import {
    AnswerFormData,
    MultipleChoiceQuestionItf,
    UserMultipleChoicesAnswerFormDataInf,
} from "../../../types/types";

type MultipleChoicesQuestionProps = {
    content: MultipleChoiceQuestionItf;
    onProvideAnswer: (answer: string[]) => void;
};

const MultipleChoicesQuestion = ({
    content,
    onProvideAnswer,
}: MultipleChoicesQuestionProps) => {
    const [optionChosen, setOptionChosen] = useState<string>();

    const handleChangeRadio = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setOptionChosen(e.target.value);
            onProvideAnswer([e.target.value]);
        }
    };

    return (
        <>
            <div
                className=""
                dangerouslySetInnerHTML={{ __html: content.text }}
            ></div>

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
        </>
    );
};

export default MultipleChoicesQuestion;
