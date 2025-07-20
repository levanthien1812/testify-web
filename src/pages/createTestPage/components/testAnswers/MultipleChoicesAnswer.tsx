import { ChangeEvent, useEffect, useState } from "react";
import {
    MultipleChoiceAnswerItf,
    MultipleChoiceQuestionItf,
} from "../../../../types/types";
import HtmlDisplay from "../../../../components/elements/HtmlDisplay";
import InstructionText from "./InstructionText";

type MultipleChoicesAnswerProps = {
    content: MultipleChoiceQuestionItf;
    reset: boolean;
    onProvideAnswer: (answerBody: MultipleChoiceAnswerItf) => void;
};

const MultipleChoicesAnswer = ({
    content,
    reset,
    onProvideAnswer,
}: MultipleChoicesAnswerProps) => {
    const [optionsChosen, setOptionsChosen] = useState<string[]>(
        content.answer && content.answer?.options?.length > 0
            ? content.answer?.options
            : []
    );

    const handleChangeRadio = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setOptionsChosen([e.target.value]);
            onProvideAnswer({ ...content.answer, options: [e.target.value] });
        }
    };

    const handleChangeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        const updatedOptions = e.target.checked
            ? [...optionsChosen, e.target.value]
            : optionsChosen.filter((option) => option !== e.target.value);
        setOptionsChosen(updatedOptions);
        onProvideAnswer({ ...content.answer, options: updatedOptions });
    };

    useEffect(() => {
        if (reset === true)
            setOptionsChosen(
                content.answer && content.answer?.options?.length > 0
                    ? content.answer?.options
                    : []
            );
    }, [reset]);

    return (
        <div>
            <InstructionText text={content.instruction_text} />
            <HtmlDisplay htmlContent={content.text} />

            <div className="space-y-1 mt-2">
                {content.options.map((option) => (
                    <div
                        className="flex gap-3 items-center ps-2 hover:bg-gray-200 cursor-pointer"
                        key={option.id}
                    >
                        {!content.allow_multiple && (
                            <input
                                type="radio"
                                name={content.id}
                                value={option.id}
                                id={option.id}
                                onChange={handleChangeRadio}
                                checked={optionsChosen[0] === option.id}
                            />
                        )}
                        {content.allow_multiple && (
                            <input
                                type="checkbox"
                                name={option.id}
                                value={option.id}
                                id={option.id}
                                onChange={handleChangeCheckbox}
                                checked={
                                    option.id
                                        ? optionsChosen.includes(option.id)
                                        : false
                                }
                            />
                        )}
                        <label htmlFor={option.id} className="grow">
                            {option.text}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultipleChoicesAnswer;
