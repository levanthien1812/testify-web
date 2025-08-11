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
    const makerAnswer = questionContent.answer?.options;
    const userAnswer = answerContent?.options;

    const getInputChecked = useCallback(
        (optionId: string) => {
            if (answerStatus === USER_ANSWER_STATUS.NOT_ANSWERED) return false;

            if (userAnswer?.includes(optionId)) return true;

            return false;
        },
        [answerStatus, userAnswer]
    );

    const getInputClasses = useCallback(
        (optionId: string) => {
            if (answerStatus === USER_ANSWER_STATUS.NOT_ANSWERED) return "";

            if (!makerAnswer && userAnswer?.includes(optionId))
                return `accent-blue-600`;

            if (makerAnswer && makerAnswer.includes(optionId))
                return `accent-green-600`;
            if (
                makerAnswer &&
                makerAnswer !== userAnswer &&
                userAnswer?.includes(optionId)
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

            if (!makerAnswer && userAnswer?.includes(optionId))
                return `text-blue-600`;

            if (makerAnswer && makerAnswer.includes(optionId))
                return `text-green-600`;
            if (
                makerAnswer &&
                makerAnswer !== userAnswer &&
                userAnswer?.includes(optionId)
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
                        {!questionContent.allow_multiple && (
                            <input
                                type="radio"
                                name={questionContent.id}
                                value={option.id}
                                id={option.id}
                                checked={getInputChecked(option.id!)}
                                className={getInputClasses(option.id!)}
                                readOnly
                            />
                        )}
                        {questionContent.allow_multiple && (
                            <input
                                type="checkbox"
                                name={option.id}
                                value={option.id}
                                id={option.id}
                                checked={
                                    option.id
                                        ? userAnswer?.includes(option.id)
                                        : false
                                }
                                className={getInputClasses(option.id!)}
                                readOnly
                            />
                        )}
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
                        {questionContent.options
                            .filter((option) =>
                                makerAnswer?.includes(option.id!)
                            )
                            ?.map((option) => (
                                <p key={option.id}>{option.text}</p>
                            ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default MultipleChoicesAnswer;
