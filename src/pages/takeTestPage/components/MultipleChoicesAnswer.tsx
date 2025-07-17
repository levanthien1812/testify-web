import { useCallback } from "react";
import {
    MultipleChoiceAnswerItf,
    MultipleChoiceQuestionItf,
} from "../../../types/types";
import { ROLES, USER_ANSWER_STATUS } from "../../../config/constants/tests";
import HtmlDisplay from "../../../components/elements/HtmlDisplay";
import { useAppSelector } from "../../../hooks/hooks";
import InstructionText from "../../createTestPage/components/testAnswers/InstructionText";

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
    const user = useAppSelector((state) => state.auth.user);
    const makerAnswer = questionContent.answer?.options?.[0];
    const userAnswer = answerContent?.options[0];

    const getInputChecked = useCallback(
        (optionId: string) => {
            if (answerStatus === USER_ANSWER_STATUS.NOT_ANSWERED) return false;

            if (optionId === userAnswer) return true;

            return false;
        },
        [answerStatus, userAnswer]
    );

    const getInputClasses = useCallback(
        (optionId: string) => {
            if (answerStatus === USER_ANSWER_STATUS.NOT_ANSWERED) return "";

            if (!makerAnswer && optionId === userAnswer)
                return `accent-blue-600`;

            if (optionId === makerAnswer) return `accent-green-600`;
            if (
                makerAnswer &&
                makerAnswer !== userAnswer &&
                optionId === userAnswer
            )
                return `accent-red-600`;
            return "";
        },
        [answerStatus, makerAnswer, userAnswer]
    );

    const getLabelClasses = useCallback(
        (optionId: string) => {
            if (user?.role === ROLES.TAKER) {
                if (answerStatus === USER_ANSWER_STATUS.NOT_ANSWERED) return "";
            }

            if (!makerAnswer && optionId === userAnswer) return `text-blue-600`;

            if (optionId === makerAnswer) return `text-green-600`;
            if (
                makerAnswer &&
                makerAnswer !== userAnswer &&
                optionId === userAnswer
            )
                return `text-red-600`;
            return "";
        },
        [answerStatus, makerAnswer, userAnswer]
    );

    return (
        <>
            <InstructionText text={questionContent.instruction_text} />
            <HtmlDisplay htmlContent={questionContent.text} />

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

            {questionContent.answer && (
                <div className="mt-2 bg-green-500 p-2">
                    <p className="text-white">Correct answer:</p>
                    <div className="text-white">
                        {
                            questionContent.options.find(
                                (option) => option.id === makerAnswer
                            )?.text
                        }
                    </div>
                </div>
            )}
        </>
    );
};

export default MultipleChoicesAnswer;
