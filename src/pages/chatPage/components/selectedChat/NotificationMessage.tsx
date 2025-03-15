import React, { forwardRef } from "react";
import { MessageItf } from "../../../../types/chat";

type NotificationMessageProps = {
    message: MessageItf;
    index: number;
};

const NotificationMessage = forwardRef<
    HTMLDivElement,
    NotificationMessageProps
>(({ message, index }, ref) => {
    return (
        <div ref={ref}>
            <p className="text-center text-gray-600 text-sm">{message.text}</p>{" "}
        </div>
    );
});

export default NotificationMessage;
