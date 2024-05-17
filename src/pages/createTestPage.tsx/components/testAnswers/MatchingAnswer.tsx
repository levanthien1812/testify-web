import React, { useState } from "react";
import { MatchingQuestionItf } from "../../../../types/types";
import DraggableItem from "./DraggableItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const MatchingAnswer: React.FC<{
    content: MatchingQuestionItf;
}> = ({ content }) => {
    const [matchings, setMatchings] = useState<
        { left: string; right: string }[]
    >([]);
    console.log(matchings);

    const handleDrop = (item: { left: string; right: string }) => {
        console.log(item);
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

    return (
        <div className="px-2 py-2 border border-orange-600">
            <p className="font-bold">{content.text}</p>

            <div className="flex gap-3 w-full mt-2 px-2">
                <div className="space-y-2 w-1/2">
                    {content.left_items.map((item) => (
                        <DraggableItem
                            item={item}
                            key={item._id}
                            onDrop={handleDrop}
                            part="left"
                            draggable={
                                matchings.findIndex(
                                    (matching) => item._id === matching.left
                                ) < 0
                            }
                        />
                    ))}
                </div>
                <div className="space-y-2 w-1/2">
                    {content.right_items.map((item) => (
                        <DraggableItem
                            item={item}
                            key={item._id}
                            onDrop={handleDrop}
                            part="right"
                            draggable={
                                matchings.findIndex(
                                    (matching) => item._id === matching.right
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
        </div>
    );
};

export default MatchingAnswer;
