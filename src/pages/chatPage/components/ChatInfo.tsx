import React from "react";
import { ChatItf } from "../../../types/chat";

type ChatInfoProps = {
    chat: ChatItf;
};

const ChatInfo = ({ chat }: ChatInfoProps) => {
    return (
        <div className="p-2 bg-white shadow-md w-1/3">
            <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                <p className="text-2xl">Chat Info</p>
            </div>
        </div>
    );
};

export default ChatInfo;
