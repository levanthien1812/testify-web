import React, { useMemo } from "react";
import { useChatSocket } from "../ChatSocketContext";
import { RootState } from "../../../../stores/rootState";
import { useSelector } from "react-redux";

const InputBlocked = () => {
    const { currentChat } = useChatSocket();
    const { user } = useSelector((state: RootState) => state.auth);

    const otherMember = useMemo(() => {
        return currentChat?.members.find(
            (member) => member.member.id !== user?.id
        );
    }, [currentChat?.members]);

    const memberToBlock = useMemo(() => {
        return currentChat!.members.find((member) => {
            if (
                member.member.id === user?.id &&
                (!user.blocked_by ||
                    user.blocked_by.length === 0 ||
                    !user.blocked_by.includes(otherMember!.member.id))
            )
                return true;
            return false;
        })?.member;
    }, [currentChat, user, otherMember]);

    return (
        <div className="border-t border-dashed border-gray-300 p-2 bg-opacity-40 bg-white flex flex-col items-center justify-center text-gray-600">
            <p className="select-none">
                {memberToBlock?.id === user?.id
                    ? `${otherMember?.member.name} is blocked`
                    : "You are blocked"}{" "}
                and cannot send messages.
            </p>
            {memberToBlock?.id === user?.id && (
                <button
                    className="bg-transparent hover:text-orange-600 font-semibold hover:underline"
                    onClick={() => {}}
                >
                    Unblock
                </button>
            )}
        </div>
    );
};

export default InputBlocked;
