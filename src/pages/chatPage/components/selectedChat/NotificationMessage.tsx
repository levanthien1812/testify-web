import React from "react";
import { MessageItf } from "../../../../types/chat";

type NotificationMessageProps = {
    message: MessageItf;
    index: number;
};

const NotificationMessage = ({ message, index }: NotificationMessageProps) => {
    return (
        <div>
            <p className="text-center text-gray-600 text-sm">{message.text}</p>{" "}
        </div>
    );
};

export default NotificationMessage;
