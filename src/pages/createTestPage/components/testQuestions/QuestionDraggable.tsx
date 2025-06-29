import React, { useState } from "react";
import { QuestionContentItf, QuestionItf } from "../../../../types/types";
import { useDispatch } from "react-redux";
import { createTestActions } from "../../../../stores/createTest";
import { useMutation } from "react-query";
import { reorderQuestions } from "../../../../services/test";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import { useAppSelector } from "../../../../hooks/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { questionTypeToIcon } from "../../../../utils/mapping";
import { shorten } from "../../../../utils/text";
import {
    faCircleCheck,
    faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

type QuestionDraggableProps = {
    question: QuestionItf<QuestionContentItf>;
    onClick: () => void;
};

const QuestionDraggable = ({ question, onClick }: QuestionDraggableProps) => {
    const { testId } = useAppSelector((state) => state.createTest);
    const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData(
            "start_index",
            JSON.stringify(question.order - 1)
        );
        if (question.part_id) {
            e.dataTransfer.setData("part_id", JSON.stringify(question.part_id));
        }
    };
    const dispatch = useDispatch();

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggedOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggedOver(false);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        setIsDraggedOver(false);
    };

    const { mutate: reorderQuestionsMutate } = useMutation({
        mutationFn: async ({
            startOrder,
            endOrder,
            partFromId,
            partToId,
        }: {
            startOrder: number;
            endOrder: number;
            partFromId?: string;
            partToId?: string;
        }) => {
            const responseData = await reorderQuestions(
                testId!,
                startOrder,
                endOrder,
                partFromId,
                partToId
            );
            return responseData;
        },
        mutationKey: MUTATION_KEYS.REORDER_QUESTIONS,
    });

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggedOver(false);

        const startIndex = JSON.parse(e.dataTransfer.getData("start_index"));
        const endIndex = question.order - 1;
        const partFromId = e.dataTransfer.getData("part_id")
            ? JSON.parse(e.dataTransfer.getData("part_id"))
            : undefined;
        const partToId = question.part_id;

        if (startIndex === endIndex && partFromId === partToId) return;

        dispatch(
            createTestActions.handleReorderQuestion({
                startIndex,
                endIndex,
                partFromId,
                partToId,
            })
        );
        reorderQuestionsMutate({
            startOrder: startIndex + 1,
            endOrder: endIndex + 1,
            partFromId,
            partToId,
        });
    };

    return (
        <div
            className={`bg-white rounded-md shadow-md hover:shadow-orange-200 overflow-hidden hover:cursor-pointer grid-item`}
            draggable
            onClick={onClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="bg-orange-50 px-2 py-1 flex items-center gap-1">
                <p>Question {question.order}</p>
                {!question.is_content_provided ? (
                    <FontAwesomeIcon
                        icon={faCircleExclamation}
                        className="text-yellow-500 text-sm"
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="text-green-500 text-sm"
                    />
                )}
                <span className="bg-orange-200 rounded-md p-1 leading-none ml-auto">
                    <FontAwesomeIcon
                        icon={questionTypeToIcon[question.type]}
                        className="text-gray-700"
                    />
                </span>
            </div>
            {question.content && question.content.text && (
                <div
                    className="p-2"
                    dangerouslySetInnerHTML={{
                        __html: shorten(question.content.text, 50),
                    }}
                ></div>
            )}
        </div>
    );
};

export default QuestionDraggable;
