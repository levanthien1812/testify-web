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
import HtmlDisplay from "../../../../components/elements/HtmlDisplay";

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
            className={`bg-white rounded-md shadow-md ${
                question.is_content_provided
                    ? "hover:shadow-green-200"
                    : "hover:shadow-orange-200"
            } overflow-hidden hover:cursor-pointer grid-item`}
            draggable
            onClick={onClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div
                className={`${
                    question.is_content_provided
                        ? "bg-teal-100"
                        : "bg-orange-500"
                } px-2 py-1 flex items-center gap-1 rounded-md`}
            >
                <span className="rounded-md p-1 leading-none">
                    <FontAwesomeIcon
                        icon={questionTypeToIcon[question.type]}
                        className="text-teal-600"
                    />
                </span>
                <p>Question {question.order}</p>
                {/* {!question.is_content_provided ? (
                    <FontAwesomeIcon
                        icon={faCircleExclamation}
                        className="text-yellow-500 text-sm"
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="text-green-500 text-sm"
                    />
                )} */}
                <span className="bg-teal-500 py-1 min-w-6 w-fit px-1 text-center rounded-md text-white leading-none ml-auto">
                    {question.score}
                </span>
            </div>
            {question.content && question.content.text && (
                <HtmlDisplay
                    htmlContent={question.content.text || ""}
                    maxLength={50}
                    className="p-2"
                />
            )}
        </div>
    );
};

export default QuestionDraggable;
