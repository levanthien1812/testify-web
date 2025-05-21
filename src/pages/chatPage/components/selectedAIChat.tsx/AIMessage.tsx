import React from "react";
import { AIChatMessageItf } from "../../../../types/chat";
import { MESSAGE_AI_ROLE } from "../../../../config/constants/chat";

type AIMessageProps = {
    message: AIChatMessageItf;
};

const AIMessage = ({ message }: AIMessageProps) => {
    return (
        <div
            className={`flex gap-1 ${
                message.role === MESSAGE_AI_ROLE.USER
                    ? "flex-row-reverse"
                    : "flex-row"
            }`}
        >
            <div className="bg-orange-600 text-white rounded-xl text-md py-1 px-4 leading-tight focus:ring-2 focus:ring-orange-600">
                {message.content}
            </div>
        </div>
    );
};

export default AIMessage;
