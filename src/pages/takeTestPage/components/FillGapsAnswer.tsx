import { useMemo } from "react";
import { FillGapsAnswerItf, FillGapsQuestionItf } from "../../../types/types";
import Input from "../../../components/elements/Input";

type FillGapsAnswerProps = {
    questionContent: FillGapsQuestionItf;
    answerContent: FillGapsAnswerItf;
};

const FillGapsAnswer = ({
    questionContent,
    answerContent,
}: FillGapsAnswerProps) => {
    const gaps = useMemo(() => {
        if (answerContent === undefined) {
            return questionContent.answer?.gaps || [];
        } else if (answerContent !== null) {
            return answerContent.gaps || [];
        }

        return [];

        // return answerContent ? answerContent.answer : content.answer || [];
    }, [answerContent, questionContent]);

    return (
        <>
            <div
                className=""
                dangerouslySetInnerHTML={{
                    __html: questionContent.text.replaceAll("***", "___"),
                }}
            ></div>

            <div className="space-y-1 mt-2">
                {[...Array(questionContent.num_gaps)].map((num, index) => (
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
                                answerContent && questionContent.answer
                                    ? answerContent.gaps[index] ===
                                      questionContent.answer.gaps[index]
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
