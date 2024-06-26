import { useMemo } from "react";
import {
    MultipleChoiceQuestionItf,
    MultipleChoicesAnswerItf,
} from "../../../types/types";
import { formatImageUrl } from "../../../utils/formatImageUrl";

type MultipleChoicesAnswerProps = {
    content: MultipleChoiceQuestionItf;
    userAnswer: MultipleChoicesAnswerItf | null;
};

const MultipleChoicesAnswer = ({
    content,
    userAnswer,
}: MultipleChoicesAnswerProps) => {
    const optionChosen = useMemo(() => {
        if (!userAnswer && content.answer) {
            return content.answer[0];
        } else if (userAnswer !== null && userAnswer.answer) {
            return userAnswer.answer[0];
        }

        return "";

        // return userAnswer && userAnswer.answer.length > 0
        //     ? userAnswer.answer[0]
        //     : content.answer
        //     ? content.answer[0]
        //     : "";
    }, [userAnswer]);

    return (
        <>
            <div
                className=""
                dangerouslySetInnerHTML={{ __html: content.text }}
            ></div>

            {content.images && (
                <div className="grid grid-cols-2 gap-2 px-[10%] mt-2 justify-items-center">
                    {content.images.map((image) => (
                        <div key={image} className="relative">
                            <img
                                src={formatImageUrl(image)}
                                alt={image}
                                className="h-[250px] border-2 hover:relative hover:scale-[2] hover:z-10 transition-transform duration-300 bg-white"
                            />
                        </div>
                    ))}
                </div>
            )}

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
                            className={
                                userAnswer
                                    ? content.answer &&
                                      content.answer[0] === option._id
                                        ? "accent-green-600"
                                        : "accent-red-600"
                                    : ""
                            }
                            readOnly
                        />
                        <label
                            htmlFor={option._id}
                            className={`grow ${
                                userAnswer
                                    ? content.answer &&
                                      content.answer[0] === option._id &&
                                      "text-green-600"
                                    : ""
                            } ${
                                userAnswer
                                    ? content.answer &&
                                      content.answer[0] !== option._id &&
                                      optionChosen === option._id &&
                                      "text-red-600"
                                    : ""
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
