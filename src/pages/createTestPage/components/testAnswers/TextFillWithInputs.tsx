import React, { useEffect, useState } from "react";
import { TipTapDoc } from "../../../../types/types";
import { FILL_GAP_METHOD } from "../../../../config/constants/tests";
import InfoMessage from "../../../../components/elements/InfoMessage";

type Props = {
    doc: TipTapDoc;
    method: FILL_GAP_METHOD;
    words?: { text: string }[];
    givenAnswers?: Record<string, string>;
    onAnswersChange?: (answers: Record<string, string>) => void;
    readonly?: boolean;
};

const TextFillWithInputs = ({
    doc,
    method,
    words,
    readonly,
    onAnswersChange,
    givenAnswers,
}: Props) => {
    const [answers, setAnswers] = useState<Record<string, string>>(
        givenAnswers || {}
    );

    const usedWords = Object.values(answers);
    const unusedWords = words?.filter((word) => !usedWords.includes(word.text));
    const [draggingWord, setDraggingWord] = useState<string | null>(null);

    const handleDrop = (nodeId: string) => {
        if (draggingWord) {
            setAnswers({
                ...answers,
                [nodeId]: draggingWord,
            });
        }
    };

    const handleRemove = (nodeId: string) => {
        setAnswers({
            ...answers,
            [nodeId]: "",
        });
    };

    useEffect(() => {
        if (onAnswersChange) {
            // onAnswersChange(answers);
        }
    }, [answers, onAnswersChange]);

    return (
        <div className="space-y-2 mt-2">
            {doc.content.map((paragraph, pIndex) => (
                <div key={pIndex} className="flex flex-wrap gap-1">
                    {paragraph.content.map((node, nIndex) => (
                        <div key={node.attrs?.id} className="my-1">
                            {node.type === "text" && <span>{node.text}</span>}
                            {node.type === "inputPlaceholder" && (
                                <input
                                    type="text"
                                    value={
                                        answers[
                                            node.attrs?.id ||
                                                `gap-${nIndex + 1}`
                                        ]
                                    }
                                    onChange={(e) =>
                                        setAnswers({
                                            ...answers,
                                            [node.attrs?.id ||
                                            `gap-${nIndex + 1}`]:
                                                e.target.value,
                                        })
                                    }
                                    id={node.attrs?.id}
                                    className={`w-fit max-w-[120px] text-center px-2 py-0 outline-none border border-gray-300 text-nowrap ${
                                        readonly
                                            ? "pointer-events-none"
                                            : "focus:border-orange-500"
                                    }}`}
                                    onDrop={() => handleDrop(node.attrs?.id)}
                                    onDragOver={(e) => e.preventDefault()}
                                    readOnly={
                                        method === FILL_GAP_METHOD.DRAG_DROP ||
                                        readonly
                                    }
                                    onDoubleClick={() => {
                                        if (readonly) return;
                                        handleRemove(node.attrs?.id);
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            ))}

            {unusedWords && unusedWords.length > 0 && (
                <div>
                    <div className="flex gap-1 flex-wrap">
                        {unusedWords.map((word) => (
                            <div
                                key={word.text}
                                className={`border border-orange-500 bg-orange-50 text-orange-600 px-4 py-1 leading-none ${
                                    readonly
                                        ? "cursor-default pointer-events-none"
                                        : "cursor-pointer hover:bg-orange-100"
                                }}`}
                                draggable={!readonly}
                                onDragStart={(e) => setDraggingWord(word.text)}
                                onDragEnd={() => setDraggingWord(null)}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                {word.text}
                            </div>
                        ))}
                    </div>
                    {!readonly && (
                        <InfoMessage message="Drag words to fill in the gaps. Double click to remove." />
                    )}
                </div>
            )}
        </div>
    );
};

export default TextFillWithInputs;
