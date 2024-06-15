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
    userAnswer,
}: MultipleChoicesAnswerProps) => {
    const optionChosen = useMemo(() => {
        return userAnswer.answer && userAnswer.answer.length > 0
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
