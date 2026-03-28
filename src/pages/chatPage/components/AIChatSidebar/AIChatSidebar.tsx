import React from "react";
import Button from "../../../../components/elements/Button";
import { useChatSocket } from "../ChatSocketContext";
import AIChatList from "./AIChatList";

const AIChatSidebar = () => {
    const { setChattingWithAI } = useChatSocket();

    const handleClickChatWithAI = () => {
        setChattingWithAI(false);
    };

    return (
        <div className="p-2 bg-white shadow-md relative flex-[1] min-w-[30%]">
            <AIChatList />
            <div className="absolute bottom-3 left-3">
                <Button
                    style={{
                        backgroundColor: "#4158D0",
                        backgroundImage:
                            "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
                    }}
                    onClick={handleClickChatWithAI}
                >
                    Back to chats
                </Button>
            </div>
        </div>
    );
};

export default AIChatSidebar;
