import { ChangeEvent, useEffect, useState } from "react";
import {
    MultipleChoiceAnswerItf,
    MultipleChoiceQuestionItf,
} from "../../../../types/types";
import { formatImageUrl } from "../../../../utils/formatImageUrl";

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
            onProvideAnswer({ options: [e.target.value] });
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
            <div
                className=""
                dangerouslySetInnerHTML={{ __html: content.text }}
            ></div>

            {content.images && (
                <div
                    className={`grid ${
                        content.images.length >= 2
                            ? "grid-cols-2"
                            : "grid-cols-1"
                    } gap-2 px-[10%] mt-2 justify-items-center`}
                >
                    {(content.images as string[]).map((image) => (
                        <div key={image} className="relative object-cover">
                            <img
                                src={formatImageUrl(image)}
                                alt={image}
                                className="h-[200px] border-2 hover:relative hover:scale-[2] hover:z-10 transition-transform duration-300 bg-white"
                            />
                        </div>
                    ))}
                </div>
            )}

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
