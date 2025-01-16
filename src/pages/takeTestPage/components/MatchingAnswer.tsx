import { useMemo } from "react";
import { MatchingAnswerItf, MatchingQuestionItf } from "../../../types/types";
import DraggableItem from "../../createTestPage.tsx/components/testAnswers/DraggableItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

type MatchingAnswerProps = {
    questionContent: MatchingQuestionItf;
    answerContent: MatchingAnswerItf;
};

const MatchingAnswer = ({
    questionContent,
    answerContent,
}: MatchingAnswerProps) => {
    const matchings = useMemo(() => {
        if (answerContent === undefined) {
            return questionContent.answer?.matchings || [];
        } else if (answerContent !== null) {
            return answerContent.matchings || [];
        }

        return [];

        // return userAnswer ? userAnswer.answer || [] : content.answer || [];
    }, [questionContent, answerContent]);

    const isCorrectMatching = (matching: { left: string; right: string }) => {
        if (questionContent.answer) {
            return questionContent.answer.matchings.find(
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
                    __html: questionContent.text,
                }}
            ></div>
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
                <div className="border border-gray-500 px-4 py-2 space-y-2">
                    {matchings.map((matching) => (
                        <div
                            key={matching.left}
                            className={`${
                                questionContent.answer &&
                                answerContent.matchings
                                    ? isCorrectMatching(matching)
                                        ? "bg-green-100"
                                        : "bg-red-100"
                                    : "bg-gray-100"
                            } px-4 py-1  grid grid-cols-9 items-center gap-2 relative`}
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
        </>
    );
};

export default MatchingAnswer;
