import { useEffect, useState } from "react";
import { MatchingQuestionItf, QuestionItf } from "../../../types/types";
import DraggableItem from "../../createTestPage/components/testAnswers/DraggableItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../../stores/takeTest";
import HtmlDisplay from "../../../components/elements/HtmlDisplay";

type MatchingQuestionProps = {
    question: QuestionItf<MatchingQuestionItf>;
};

const MatchingQuestion = ({ question }: MatchingQuestionProps) => {
    const [matchings, setMatchings] = useState<
        { left: string; right: string }[]
    >([]);
    const dispatch = useDispatch();

    const handleDrop = (item: { left: string; right: string }) => {
        const index = matchings.findIndex((matching) => {
            return matching.left === item.left && matching.right === item.right;
        });

        if (index < 0) {
            setMatchings([...matchings, item]);
        }
    };

    const handleDeleteMatching = (leftItemId: string) => {
        let updatedMatchings = [...matchings];
        const index = matchings.findIndex(
            (matching) => matching.left === leftItemId
        );
        updatedMatchings.splice(index, 1);
        setMatchings(updatedMatchings);
    };

    useEffect(() => {
        if (matchings.length > 0) {
            dispatch(
                takeTestActions.addAnswer({
                    question_id: question.id!,
                    content: { matchings },
                })
            );
        }
    }, [matchings]);

    return (
        <>
            <HtmlDisplay htmlContent={question.content!.text} />
            <div className="flex gap-3 w-full mt-2 px-2">
                <div className="space-y-2 w-1/2">
                    {question.content!?.left_items?.map((item) => (
                        <DraggableItem
                            item={item}
                            key={item.id}
                            onDrop={handleDrop}
                            part="left"
                            draggable={
                                matchings.findIndex(
                                    (matching) => item.id === matching.left
                                ) < 0
                            }
                        />
                    ))}
                </div>
                <div className="space-y-2 w-1/2">
                    {question.content!?.right_items?.map((item) => (
                        <DraggableItem
                            item={item}
                            key={item.id}
                            onDrop={handleDrop}
                            part="right"
                            draggable={
                                matchings.findIndex(
                                    (matching) => item.id === matching.right
                                ) < 0
                            }
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
                            className="bg-gray-100 px-4 py-1 flex items-center gap-2 relative"
                        >
                            <span>
                                {
                                    question.content!.left_items.find(
                                        (left_item) =>
                                            left_item.id === matching.left
                                    )?.text
                                }
                            </span>
                            <FontAwesomeIcon
                                icon={faArrowRight}
                                className="text-xs"
                            />
                            <span>
                                {
                                    question.content!.right_items.find(
                                        (right_item) =>
                                            right_item.id === matching.right
                                    )?.text
                                }
                            </span>
                            <button
                                onClick={() =>
                                    handleDeleteMatching(matching.left)
                                }
                                className="absolute top-1 right-4 hover:font-bold"
                            >
                                Clear
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MatchingQuestion;
