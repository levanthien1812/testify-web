import { useCallback, useMemo } from "react";
import {
    MultipleChoiceAnswerItf,
    MultipleChoiceQuestionItf,
} from "../../../types/types";
import { formatImageUrl } from "../../../utils/formatImageUrl";
import { USER_ANSWER_STATUS } from "../../../config/constants/tests";

type MultipleChoicesAnswerProps = {
    questionContent: MultipleChoiceQuestionItf;
    answerContent: MultipleChoiceAnswerItf;
    answerStatus: USER_ANSWER_STATUS;
};

const MultipleChoicesAnswer = ({
    questionContent,
    answerContent,
    answerStatus,
}: MultipleChoicesAnswerProps) => {
    const makerAnswer = questionContent.answer?.options?.[0];
    const userAnswer = answerContent?.options[0];

    const getInputChecked = useCallback(
        (optionId: string) => {
            if (answerStatus === USER_ANSWER_STATUS.NOT_ANSWERED) return false;

            if (optionId === makerAnswer) return true;
            if (!makerAnswer && optionId === userAnswer) return true;
            return false;
        },
        [answerStatus, makerAnswer, userAnswer]
    );

    const getInputClasses = useCallback(
        (optionId: string) => {
            if (answerStatus === USER_ANSWER_STATUS.NOT_ANSWERED) return "";

            if (!makerAnswer && optionId === userAnswer)
                return `accent-blue-600`;

            if (optionId === makerAnswer) return `accent-green-600`;
            if (makerAnswer && makerAnswer !== userAnswer)
                return `accent-red-600`;
            return "";
        },
        [answerStatus, makerAnswer, userAnswer]
    );

    const getLabelClasses = useCallback(
        (optionId: string) => {
            if (answerStatus === USER_ANSWER_STATUS.NOT_ANSWERED) return "";

            if (!makerAnswer && optionId === userAnswer) return `text-blue-600`;

            if (optionId === makerAnswer) return `text-green-600`;
            if (makerAnswer && makerAnswer !== userAnswer)
                return `text-red-600`;
            return "";
        },
        [answerStatus, makerAnswer, userAnswer]
    );

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
                            checked={getInputChecked(option.id!)}
                            className={getInputClasses(option.id!)}
                            readOnly
                        />
                        <label
                            htmlFor={option.id}
                            className={`grow ${getLabelClasses(option.id!)}`}
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
