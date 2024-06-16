import { useMemo } from "react";
import {
    MultipleChoiceQuestionItf,
    MultipleChoicesAnswerItf,
} from "../../../types/types";

type MultipleChoicesAnswerProps = {
    content: MultipleChoiceQuestionItf;
    userAnswer: MultipleChoicesAnswerItf;
};

const MultipleChoicesAnswer = ({
    content,
    userAnswer ,
}: MultipleChoicesAnswerProps) => {
    const optionChosen = useMemo(() => {
        return userAnswer && userAnswer.answer.length > 0
            ? userAnswer.answer[0]
            : "";
    }, [userAnswer]);

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
                            checked={
                                content.answer
                                    ? content.answer[0] === option._id
                                    : option._id === optionChosen
                            }
                            className={
                                content.answer &&
                                content.answer[0] === option._id
                                    ? "accent-blue-600"
                                    : "accent-red-600"
                            }
                        />
                        <label
                            htmlFor={option._id}
                            className={`grow ${
                                content.answer &&
                                content.answer[0] === option._id &&
                                "text-blue-600"
                            } ${
                                content.answer &&
                                content.answer[0] !== option._id &&
                                optionChosen === option._id &&
                                "text-red-600"
                            }`}
                        >
                            {option.text}
                        </label>
                    </div>
                ))}
            </div>
        </>
    );
};

export default MultipleChoicesAnswer;
