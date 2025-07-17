import { useCallback } from "react";
import { MatchingAnswerItf, MatchingQuestionItf } from "../../../types/types";
import DraggableItem from "../../createTestPage/components/testAnswers/DraggableItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { USER_ANSWER_STATUS } from "../../../config/constants/tests";
import HtmlDisplay from "../../../components/elements/HtmlDisplay";
import InstructionText from "../../createTestPage/components/testAnswers/InstructionText";

type MatchingAnswerProps = {
    questionContent: MatchingQuestionItf;
    answerContent: MatchingAnswerItf;
    answerStatus: USER_ANSWER_STATUS;
};

const MatchingAnswer = ({
    questionContent,
    answerContent,
    answerStatus,
}: MatchingAnswerProps) => {
    const makerAnswer = questionContent.answer?.matchings;
    const userAnswer = answerContent?.matchings;

    const isCorrectMatching = (matching: { left: string; right: string }) => {
        if (questionContent.answer) {
            return questionContent.answer.matchings?.find(
                (answer) =>
                    answer.left === matching.left &&
                    answer.right === matching.right
            );
        } else {
            return false;
        }
    };

    const getClasses = useCallback(
        (matching: { left: string; right: string; is_correct?: boolean }) => {
            if (!makerAnswer && userAnswer) return "bg-gray-100 text-blue-600";

            if (makerAnswer && isCorrectMatching(matching))
                return `bg-green-100 text-green-600`;
            if (makerAnswer && !isCorrectMatching(matching))
                return `bg-red-100 text-red-600`;
            return `bg-gray-100 text-black`;
        },
        [answerStatus, makerAnswer, userAnswer]
    );

    return (
        <>
            <InstructionText text={questionContent.instruction_text} />
            <HtmlDisplay htmlContent={questionContent.text} />
            <div className="flex gap-3 w-full mt-2 px-2">
                <div className="space-y-2 w-1/2">
                    {questionContent.left_items.map((item) => (
                        <DraggableItem
                            item={item}
                            key={item.id}
                            onDrop={() => {}}
                            part="left"
                            draggable={false}
                        />
                    ))}
                </div>
                <div className="space-y-2 w-1/2">
                    {questionContent.right_items.map((item) => (
                        <DraggableItem
                            item={item}
                            key={item.id}
                            onDrop={() => {}}
                            part="right"
                            draggable={false}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-2">
                <p>Matchings:</p>
                <div className="border border-gray-500 px-2 py-2 space-y-2">
                    {userAnswer &&
                        userAnswer.map((matching) => (
                            <div
                                key={matching.left}
                                className={`${getClasses(
                                    matching
                                )} px-4 py-1 grid grid-cols-9 items-center gap-2 relative`}
                            >
                                <span className="col-span-4">
                                    {
                                        questionContent.left_items.find(
                                            (left_item) =>
                                                left_item.id === matching.left
                                        )?.text
                                    }
                                </span>
                                <span className="col-span-1 text-center">
                                    <FontAwesomeIcon
                                        icon={faArrowRight}
                                        className="text-xs"
                                    />
                                </span>

                                <span className="col-span-4">
                                    {
                                        questionContent.right_items.find(
                                            (right_item) =>
                                                right_item.id === matching.right
                                        )?.text
                                    }
                                </span>
                            </div>
                        ))}
                </div>
            </div>

            {questionContent.answer && (
                <div className="mt-2 bg-green-500 p-2">
                    <p className="text-white">Correct answer:</p>
                    <div className="text-white">
                        {questionContent.answer.matchings.length > 0 && (
                            <div className="space-y-2">
                                {questionContent.answer.matchings.map(
                                    (matching) => (
                                        <div
                                            key={matching.left}
                                            className="px-4 py-1 grid grid-cols-7 items-center gap-1 relative border border-white text-white"
                                        >
                                            <span className="col-span-3">
                                                {
                                                    questionContent.left_items.find(
                                                        (left_item) =>
                                                            left_item.id ===
                                                            matching.left
                                                    )?.text
                                                }
                                            </span>
                                            <div className="col-span-1 text-center">
                                                <FontAwesomeIcon
                                                    icon={faArrowRight}
                                                    className="text-xs "
                                                />
                                            </div>
                                            <span className="col-span-3">
                                                {
                                                    questionContent.right_items.find(
                                                        (right_item) =>
                                                            right_item.id ===
                                                            matching.right
                                                    )?.text
                                                }
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default MatchingAnswer;
