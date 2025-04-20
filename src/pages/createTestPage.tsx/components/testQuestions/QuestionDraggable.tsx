import React, { useState } from "react";
import { QuestionContentItf, QuestionItf } from "../../../../types/types";
import { useDispatch } from "react-redux";
import { createTestActions } from "../../../../stores/createTest";
import { toast } from "react-toastify";
import { TOAST_MESSAGES } from "../../../../config/constants/toasts";

type QuestionDraggableProps = {
    question: QuestionItf<QuestionContentItf>;
    onClick: () => void;
};

const QuestionDraggable = ({ question, onClick }: QuestionDraggableProps) => {
    const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData(
            "start_index",
            JSON.stringify(question.order - 1)
        );
        e.dataTransfer.setData("part_id", JSON.stringify(question.part_id));
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

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (
            question.part_id !== JSON.parse(e.dataTransfer.getData("part_id"))
        ) {
            toast.warning(TOAST_MESSAGES.CANNOT_MOVE_QUESTION_TO_ANOTHER_PART);
            return;
        }
        const startIndex = JSON.parse(e.dataTransfer.getData("start_index"));
        const endIndex = question.order - 1;
        if (startIndex === endIndex) return;
        dispatch(
            createTestActions.handleReorderQuestion({
                startIndex,
                endIndex,
                partId: question.part_id,
            })
        );
    };

    return (
        <div
            className={`bg-orange-100 p-2 cursor-pointer hover:bg-orange-200 relative ${
                (question.is_content_provided || isDraggedOver) &&
                "border border-orange-500"
            }`}
            draggable
            onClick={onClick}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <p className="text-center">Question {question?.order}</p>
            {question.is_content_provided && (
                <>
                    <div
                        className="absolute bottom-0 right-0 w-0 h-0 z-0"
                        style={{
                            borderRight: "8px solid rgb(249 115 22)",
                            borderBottom: "8px solid rgb(249 115 22)",
                            borderTop: "8px solid transparent",
                            borderLeft: "8px solid transparent",
                        }}
                    >
                        {/* <FontAwesomeIcon
                            icon={faCheck}
                            className="text-white leading-none"
                        /> */}
                    </div>
                </>
            )}
        </div>
    );
};

export default QuestionDraggable;
