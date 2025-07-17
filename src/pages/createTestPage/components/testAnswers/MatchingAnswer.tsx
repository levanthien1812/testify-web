import { useEffect, useState } from "react";
import {
    MatchingAnswerItf,
    MatchingQuestionItf,
} from "../../../../types/types";
import DraggableItem from "./DraggableItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../../components/elements/Button";
import HtmlDisplay from "../../../../components/elements/HtmlDisplay";
import InstructionText from "./InstructionText";

type MatchingAnswerProps = {
    content: MatchingQuestionItf;
    reset: boolean;
    onProvideAnswer: (answerBody: MatchingAnswerItf) => void;
};

const MatchingAnswer = ({
    content,
    onProvideAnswer,
    reset,
}: MatchingAnswerProps) => {
    const [matchings, setMatchings] = useState<
        { left: string; right: string }[]
    >(content.answer?.matchings || []);

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
        if (
            matchings.length > 0 &&
            matchings.length !== content.answer?.matchings?.length
        ) {
            onProvideAnswer({ ...content.answer, matchings });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchings]);

    useEffect(() => {
        if (reset === true) setMatchings(content.answer?.matchings || []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reset]);

    return (
        <>
            <InstructionText text={content.instruction_text} />
            <HtmlDisplay htmlContent={content.text} />
            <div className="grid grid-cols-2 gap-3 w-full mt-2 px-2 auto-rows-fr">
                <div className="space-y-2">
                    {content.left_items.map((item) => (
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
                <div className="space-y-2">
                    {content.right_items.map((item) => (
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
                {matchings.length === 0 && (
                    <p className="text-gray-500 text-sm italic">
                        No matchings provided!
                    </p>
                )}
                {matchings.length > 0 && (
                    <div className="border border-gray-500 px-4 py-2 space-y-2">
                        {matchings.map((matching) => (
                            <div
                                key={matching.left}
                                className="bg-gray-100 px-4 py-1 grid grid-cols-8 items-center gap-1 relative"
                            >
                                <span className="col-span-3">
                                    {
                                        content.left_items.find(
                                            (left_item) =>
                                                left_item.id === matching.left
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
                                        content.right_items.find(
                                            (right_item) =>
                                                right_item.id === matching.right
                                        )?.text
                                    }
                                </span>
                                <Button
                                    onClick={() =>
                                        handleDeleteMatching(matching.left)
                                    }
                                    size="sm"
                                    secondary
                                    className="shrink-0"
                                >
                                    Clear
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MatchingAnswer;
