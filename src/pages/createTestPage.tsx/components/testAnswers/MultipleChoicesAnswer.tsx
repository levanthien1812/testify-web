import { ChangeEvent, useEffect, useState } from "react";
import { AnswerBody, MultipleChoiceQuestionItf } from "../../../../types/types";

type MultipleChoicesAnswerProps = {
    content: MultipleChoiceQuestionItf;
    reset: boolean;
    onProvideAnswer: (answerBody: AnswerBody) => void;
};

const MultipleChoicesAnswer = ({
    content,
    reset,
    onProvideAnswer,
}: MultipleChoicesAnswerProps) => {
    const [optionChosen, setOptionChosen] = useState<string>(
        content.answer && content.answer.length > 0 ? content.answer[0] : ""
    );

    const handleChangeRadio = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setOptionChosen(e.target.value);
            onProvideAnswer({ answer: [e.target.value] });
        }
    };

    useEffect(() => {
        if (reset === true)
            setOptionChosen(
                content.answer && content.answer.length > 0
                    ? content.answer[0]
                    : ""
            );
    }, [reset]);

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

export default MultipleChoicesAnswer;
