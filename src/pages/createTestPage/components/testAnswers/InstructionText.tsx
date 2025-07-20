import React from "react";

const InstructionText = ({ text }: { text: string | undefined }) => {
    if (!text) return null;
    return <p className="text-gray-600 italic">{text}</p>;
};

export default InstructionText;
