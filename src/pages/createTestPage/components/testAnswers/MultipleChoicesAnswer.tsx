import { ChangeEvent, useEffect, useState } from "react";
import {
    MultipleChoiceAnswerItf,
    MultipleChoiceQuestionItf,
} from "../../../../types/types";
import { formatImageUrl } from "../../../../utils/formatImageUrl";
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
    const [optionChosen, setOptionChosen] = useState<string>(
        content.answer && content.answer?.options?.length > 0
            ? content.answer?.options[0]
            : ""
    );

    const handleChangeRadio = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setOptionChosen(e.target.value);
            onProvideAnswer({ ...content.answer, options: [e.target.value] });
        }
    };

    useEffect(() => {
        if (reset === true)
            setOptionChosen(
                content.answer && content.answer?.options?.length > 0
                    ? content.answer?.options[0]
                    : ""
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
                        <input
                            type="radio"
                            name={content.id}
                            value={option.id}
                            id={option.id}
                            onChange={handleChangeRadio}
                            checked={optionChosen === option.id}
                        />
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
