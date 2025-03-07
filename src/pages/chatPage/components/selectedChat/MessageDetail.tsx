import React from "react";
import InfoModal from "../../../../components/modals/InfoModal";
import { MessageItf } from "../../../../types/chat";
import { format } from "date-fns";

type MessageDetailProps = {
    message: MessageItf;
    onClose: () => void;
};

const MessageDetail = ({ message, onClose }: MessageDetailProps) => {
    return (
        <InfoModal onClose={onClose} title="Message Detail">
            <div>
                <p>Sent at: {format(message.created_at, "dd/MM/yyyy HH:mm")}</p>
                {message.deleted && (
                    <p>
                        Deleted at{" "}
                        {format(message.updated_at, "dd/MM/yyyy HH:mm")}
                    </p>
                )}
            </div>
        </InfoModal>
    );
};

export default MessageDetail;
