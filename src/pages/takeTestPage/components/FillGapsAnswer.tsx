import { useMemo } from "react";
import { FillGapsAnswerItf, FillGapsQuestionItf } from "../../../types/types";
import Input from "../../../components/elements/Input";

type FillGapsAnswerProps = {
    content: FillGapsQuestionItf;
    userAnswer: FillGapsAnswerItf | null;
};

const FillGapsAnswer = ({ content, userAnswer }: FillGapsAnswerProps) => {
    const gaps = useMemo(() => {
        if (!userAnswer) {
            return content.answer || [];
        } else if (userAnswer !== null) {
            return userAnswer.answer || [];
        }

        return [];

        // return userAnswer ? userAnswer.answer : content.answer || [];
    }, [userAnswer]);

    return (
        <>
            <div
                className=""
                dangerouslySetInnerHTML={{
                    __html: content.text.replaceAll("***", "___"),
                }}
            ></div>

            <div className="space-y-1 mt-2">
                {[...Array(content.num_gaps)].map((num, index) => (
                    <div className="flex gap-3 items-end ps-2" key={index + 1}>
                        <label
                            htmlFor={`gap${index + 1}`}
                            className="text-nowrap"
                        >
                            Gap {index + 1}:
                        </label>
                        <Input
                            type="text"
                            name={`gap-${index + 1}`}
                            value={gaps[index]}
                            id={`gap-${index + 1}`}
                            className={`border ${
                                userAnswer && content.answer
                                    ? userAnswer.answer[index] ===
                                      content.answer[index]
                                        ? "border-green-600 text-blue"
                                        : "border-red-600 text-red"
                                    : "border-gray-500 text-black"
                            } grow`}
                            readOnly
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export default FillGapsAnswer;
