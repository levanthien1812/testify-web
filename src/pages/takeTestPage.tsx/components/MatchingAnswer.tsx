import { useMemo } from "react";
import { MatchingAnswerItf, MatchingQuestionItf } from "../../../types/types";
import DraggableItem from "../../createTestPage.tsx/components/testAnswers/DraggableItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

type MatchingAnswerProps = {
    content: MatchingQuestionItf;
    userAnswer: MatchingAnswerItf;
};

const MatchingAnswer = ({ content, userAnswer }: MatchingAnswerProps) => {
    const matchings = useMemo(() => {
        return userAnswer.answer || [];
    }, [userAnswer]);

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
                            className="bg-gray-200 px-4 py-1 flex items-center gap-2 relative"
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
