import { useMemo } from "react";
import { MatchingAnswerItf, MatchingQuestionItf } from "../../../types/types";
import DraggableItem from "../../createTestPage.tsx/components/testAnswers/DraggableItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

type MatchingAnswerProps = {
    content: MatchingQuestionItf;
    userAnswer: MatchingAnswerItf | null;
};

const MatchingAnswer = ({ content, userAnswer }: MatchingAnswerProps) => {
    const matchings = useMemo(() => {
        if (!userAnswer) {
            return content.answer || [];
        } else if (userAnswer !== null) {
            return userAnswer.answer || [];
        }

        return [];

        // return userAnswer ? userAnswer.answer || [] : content.answer || [];
    }, [userAnswer]);

    const isCorrectMatching = (matching: { left: string; right: string }) => {
        if (content.answer) {
            return content.answer.find(
                (answer) =>
                    answer.left === matching.left &&
                    answer.right === matching.right
            );
        } else {
            return false;
        }
    };

    return (
        <>
            <div
                className=""
                dangerouslySetInnerHTML={{
                    __html: content.text,
                }}
            ></div>
            <div className="flex gap-3 w-full mt-2 px-2">
                <div className="space-y-2 w-1/2">
                    {content.left_items.map((item) => (
                        <DraggableItem
                            item={item}
                            key={item._id}
                            onDrop={() => {}}
                            part="left"
                            draggable={false}
                        />
                    ))}
                </div>
                <div className="space-y-2 w-1/2">
                    {content.right_items.map((item) => (
                        <DraggableItem
                            item={item}
                            key={item._id}
                            onDrop={() => {}}
                            part="right"
                            draggable={false}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-2">
                <p>Matchings:</p>
                <div className="border border-gray-500 px-4 py-2 space-y-2">
                    {matchings.map((matching) => (
                        <div
                            key={matching.left}
                            className={`${
                                content.answer && userAnswer
                                    ? isCorrectMatching(matching)
                                        ? "bg-green-100"
                                        : "bg-red-100"
                                    : "bg-gray-100"
                            } px-4 py-1 flex items-center gap-2 relative`}
                        >
                            <span>
                                {
                                    content.left_items.find(
                                        (left_item) =>
                                            left_item._id === matching.left
                                    )?.text
                                }
                            </span>
                            <FontAwesomeIcon
                                icon={faArrowRight}
                                className="text-xs"
                            />
                            <span>
                                {
                                    content.right_items.find(
                                        (right_item) =>
                                            right_item._id === matching.right
                                    )?.text
                                }
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MatchingAnswer;
