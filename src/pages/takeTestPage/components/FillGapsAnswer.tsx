import { useCallback, useMemo } from "react";
import { FillGapsAnswerItf, FillGapsQuestionItf } from "../../../types/types";
import Input from "../../../components/elements/Input";
import {
    FILL_GAP_INDICATOR,
    USER_ANSWER_STATUS,
} from "../../../config/constants/tests";
import HtmlDisplay from "../../../components/elements/HtmlDisplay";

type FillGapsAnswerProps = {
    questionContent: FillGapsQuestionItf;
    answerContent: FillGapsAnswerItf;
    answerStatus: USER_ANSWER_STATUS;
};

const FillGapsAnswer = ({
    questionContent,
    answerContent,
    answerStatus,
}: FillGapsAnswerProps) => {
    const makerAnswer = questionContent.answer?.gaps;
    const userAnswer = answerContent?.gaps;

    const getLabelClasses = useCallback(
        (index: number) => {
            if (!makerAnswer || !userAnswer)
                return "border-gray-500 text-black";

            if (makerAnswer[index] === userAnswer[index])
                return "border-green-600 text-blue";
            if (makerAnswer[index] !== userAnswer[index])
                return "border-red-600 text-red";
            return "border-gray-500 text-black";
        },
        [answerStatus, makerAnswer, userAnswer]
    );

    const textReplacements = useMemo(() => {
        if (!questionContent.answer) return "";

        const subStrings = questionContent.text.split(FILL_GAP_INDICATOR);
        const filledText = subStrings.map((subString, index) => {
            if (index === 0) return <span>{subString}</span>;
            return (
                <span key={index}>
                    {" "}
                    <span className="text-white underline font-bold">
                        {questionContent.answer?.gaps?.[index - 1]}
                    </span>{" "}
                    <span>{subString}</span>
                </span>
            );
        });

        return <p className="text-white">{filledText}</p>;
    }, [questionContent]);

    return (
        <>
            <HtmlDisplay
                htmlContent={questionContent.text.replaceAll("***", "___")}
            />

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
                            value={userAnswer?.[index] || ""}
                            id={`gap-${index + 1}`}
                            className={`border ${getLabelClasses(index)} grow`}
                            readOnly
                        />
                    </div>
                ))}
            </div>

            {questionContent.answer && (
                <div className="mt-2 bg-green-500 p-2">
                    <p className="text-white">Correct answer:</p>
                    <div>{textReplacements} </div>
                </div>
            )}
        </>
    );
};

export default FillGapsAnswer;
