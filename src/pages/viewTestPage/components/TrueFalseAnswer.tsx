import { useCallback } from "react";
import { TrueFalseAnswerItf, TrueFalseQuestionItf } from "../../../types/types";
import { ROLES, USER_ANSWER_STATUS } from "../../../config/constants/tests";
import HtmlDisplay from "../../../components/elements/HtmlDisplay";
import { useAppSelector } from "../../../hooks/hooks";
import InstructionText from "../../createTestPage/components/testAnswers/InstructionText";

type TrueFalseAnswerProps = {
    questionContent: TrueFalseQuestionItf;
    answerContent: TrueFalseAnswerItf;
    answerStatus: USER_ANSWER_STATUS;
    includeUserAnswer?: boolean;
};

const TrueFalseAnswer = ({
    questionContent,
    answerContent,
    answerStatus,
    includeUserAnswer,
}: TrueFalseAnswerProps) => {
    const user = useAppSelector((state) => state.auth.user);
    const makerAnswer = questionContent.answer?.is_true;
    const userAnswer = answerContent?.is_true;

    const getInputChecked = useCallback(
        (isTrue: boolean) => {
            if (answerStatus === USER_ANSWER_STATUS.NOT_ANSWERED) return false;

            if (isTrue === userAnswer) return true;
            if (isTrue === makerAnswer) return true;

            return false;
        },
        [answerStatus, userAnswer, makerAnswer]
    );

    const getInputClasses = useCallback(
        (isTrue: boolean) => {
            if (answerStatus === USER_ANSWER_STATUS.NOT_ANSWERED) return "";

            if (makerAnswer === undefined && isTrue === userAnswer)
                return `accent-blue-600`;

            if (isTrue === makerAnswer) return `accent-green-600`;
            if (
                makerAnswer !== undefined &&
                makerAnswer !== userAnswer &&
                isTrue === userAnswer
            )
                return `accent-red-600`;
            return "";
        },
        [answerStatus, makerAnswer, userAnswer]
    );

    const getLabelClasses = useCallback(
        (isTrue: boolean) => {
            if (user?.role === ROLES.TAKER) {
                if (answerStatus === USER_ANSWER_STATUS.NOT_ANSWERED) return "";
            }

            if (makerAnswer === undefined && isTrue === userAnswer)
                return `text-blue-600`;

            if (isTrue === makerAnswer) return `text-green-600`;
            if (
                makerAnswer !== undefined &&
                makerAnswer !== userAnswer &&
                isTrue === userAnswer
            )
                return `text-red-600`;
            return "";
        },
        [answerStatus, makerAnswer, userAnswer, includeUserAnswer]
    );

    return (
        <>
            <InstructionText text={questionContent.instruction_text} />
            <HtmlDisplay htmlContent={questionContent.text} />

            <div className="flex gap-1 mt-2">
                {[true, false].map((option) => (
                    <div
                        className="flex gap-3 items-center ps-2 hover:bg-gray-200 cursor-pointer"
                        key={`${option}`}
                    >
                        <input
                            type="radio"
                            name={questionContent.id}
                            value={`${option}`}
                            id={`${option}`}
                            checked={getInputChecked(option)}
                            className={getInputClasses(option)}
                            readOnly
                        />
                        <label
                            htmlFor={`${option}`}
                            className={`grow ${getLabelClasses(option)}`}
                        >
                            {option ? "True" : "False"}
                        </label>
                    </div>
                ))}
            </div>

            {questionContent.answer && includeUserAnswer && (
                <div className="mt-2 bg-green-500 p-2">
                    <p className="text-white">Correct answer:</p>
                    <div className="text-white">
                        {questionContent.answer.is_true ? "True" : "False"}
                    </div>
                </div>
            )}
        </>
    );
};

export default TrueFalseAnswer;
