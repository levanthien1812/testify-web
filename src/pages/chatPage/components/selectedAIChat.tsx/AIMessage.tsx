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
            <div
                className={` ${
                    message.role === MESSAGE_AI_ROLE.USER
                        ? "bg-orange-600 text-white border-none"
                        : "border border-orange-600 bg-white text-black"
                } rounded-xl text-md py-1 px-4 leading-tight focus:ring-2 focus:ring-orange-600 whitespace-pre-wrap max-w-[80%]`}
            >
                {message.content}
            </div>
        </div>
    );
};

export default AIMessage;
