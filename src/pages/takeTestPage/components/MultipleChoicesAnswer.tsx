import { useMemo } from "react";
import {
    MultipleChoiceAnswerItf,
    MultipleChoiceQuestionItf,
} from "../../../types/types";
import { formatImageUrl } from "../../../utils/formatImageUrl";

type MultipleChoicesAnswerProps = {
    questionContent: MultipleChoiceQuestionItf;
    answerContent: MultipleChoiceAnswerItf;
};

const MultipleChoicesAnswer = ({
    questionContent,
    answerContent,
}: MultipleChoicesAnswerProps) => {
    const optionChosen = useMemo(() => {
        if (answerContent === undefined && questionContent.answer?.options) {
            return questionContent.answer?.options[0];
        } else if (answerContent) {
            return answerContent.options[0];
        }

        return "";

        // return answerContent && answerQuesquestionContent.answer.length > 0
        //     ? answerQuesquestionContent.answer[0]
        //     : questionContent.answer
        //     ? questionContent.answer[0]
        //     : "";
    }, [answerContent, questionContent]);

    return (
        <>
            <div
                className=""
                dangerouslySetInnerHTML={{ __html: questionContent.text }}
            ></div>

            {questionContent.images && (
                <div className="grid grid-cols-2 gap-2 px-[10%] mt-2 justify-items-center">
                    {(questionContent.images as string[]).map((image) => (
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
                {questionContent.options.map((option) => (
                    <div
                        className="flex gap-3 items-center ps-2 hover:bg-gray-200 cursor-pointer"
                        key={option.id}
                    >
                        <input
                            type="radio"
                            name={questionContent.id}
                            value={option.id}
                            id={option.id}
                            checked={optionChosen === option.id}
                            className={
                                answerContent
                                    ? questionContent.answer &&
                                      questionContent.answer.options[0] ===
                                          option.id
                                        ? "accent-green-600"
                                        : "accent-red-600"
                                    : ""
                            }
                            readOnly
                        />
                        <label
                            htmlFor={option.id}
                            className={`grow ${
                                answerContent
                                    ? questionContent.answer &&
                                      questionContent.answer.options[0] ===
                                          option.id &&
                                      "text-green-600"
                                    : ""
                            } ${
                                answerContent
                                    ? questionContent.answer &&
                                      questionContent.answer.options[0] !==
                                          option.id &&
                                      optionChosen === option.id &&
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
