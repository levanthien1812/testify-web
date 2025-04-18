import { useCallback, useMemo } from "react";
import { FillGapsAnswerItf, FillGapsQuestionItf } from "../../../types/types";
import Input from "../../../components/elements/Input";
import { USER_ANSWER_STATUS } from "../../../config/constants/tests";

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
            if (!makerAnswer) return "border-gray-500 text-black";

            if (makerAnswer[index] === userAnswer[index])
                return "border-green-600 text-blue";
            if (makerAnswer[index] !== userAnswer[index])
                return "border-red-600 text-red";
            return "border-gray-500 text-black";
        },
        [answerStatus, makerAnswer, userAnswer]
    );

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
                            value={userAnswer[index]}
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
