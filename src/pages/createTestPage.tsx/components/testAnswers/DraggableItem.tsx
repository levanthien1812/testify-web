import React, { useState } from "react";

const DraggableItem: React.FC<{
    item: { _id: string; text: string };
    onDrop: (item: { left: string; right: string }) => void;
    part: "left" | "right";
    draggable: boolean;
}> = ({ item, onDrop, part, draggable }) => {
    const [dragStart, setDragStart] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("source_text", item._id);
        e.dataTransfer.setData("source_part", part);
        setDragStart(true);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragStart(false);
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        setDragOver(false);
        const sourceText = e.dataTransfer.getData("source_text");
        const sourcePart = e.dataTransfer.getData("source_part");

        if (part !== sourcePart) {
            if (part === "left") {
                onDrop({ left: item._id, right: sourceText });
            } else {
                onDrop({ left: sourceText, right: item._id });
            }
        }

        e.preventDefault();
    };

    return (
        <div
            className={`px-4 py-1 ${
                (dragOver || dragStart) && "border border-orange-600"
            } ${
                draggable
                    ? "bg-gray-100 cursor-pointer hover:bg-gray-200"
                    : "bg-orange-200 cursor-not-allowed"
            }`}
            draggable={draggable}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            onDragLeave={handleDragLeave}
        >
            {item.text}
        </div>
    );
};

export default DraggableItem;
