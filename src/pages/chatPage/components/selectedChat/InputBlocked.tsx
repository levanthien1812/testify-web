import React, { useMemo } from "react";
import { useChatSocket } from "../ChatSocketContext";
import { RootState } from "../../../../stores/rootState";
import { useSelector } from "react-redux";

const InputBlocked = () => {
    const { currentChat } = useChatSocket();
    const { user } = useSelector((state: RootState) => state.auth);

    const memberToBlock = useMemo(() => {
        return currentChat!.members.find(
            (member) => member.member.id !== user?.id
        )?.member;
    }, [currentChat, user]);

    return (
        <div className="border-t border-dashed border-gray-300 p-2 bg-opacity-40 bg-white flex flex-col items-center justify-center text-gray-600">
            <p className="select-none">
                {memberToBlock?.name} is blocked and cannot send messages.
            </p>
            <button
                className="bg-transparent hover:text-orange-600 font-semibold hover:underline"
                onClick={() => {}}
            >
                Unblock
            </button>
        </div>
    );
};

export default InputBlocked;
