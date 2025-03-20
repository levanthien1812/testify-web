import React, { useMemo } from "react";
import { useChatSocket } from "../ChatSocketContext";
import { RootState } from "../../../../stores/rootState";
import { useSelector } from "react-redux";
import { unblockUser } from "../../../../services/user";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import { useDispatch } from "react-redux";
import { useMutation } from "react-query";
import { SOCKET_EVENTS } from "../../../../config/constants/socket";
import { authActions } from "../../../../stores/auth";

const InputBlocked = () => {
    const { currentChat, socket } = useChatSocket();
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const { mutate: unblockUserMutate, isLoading: isUnblockingUser } =
        useMutation({
            mutationFn: async () => {
                const response = await unblockUser(
                    currentChat?.member_to_be_blocked?.member.id!
                );
                return response;
            },
            mutationKey: [MUTATION_KEYS.BLOCK_USER],
            onSuccess: (data) => {
                dispatch(authActions.unblockUser(data.unblockedUser.id));
                if (socket) {
                    socket.emit(SOCKET_EVENTS.UNBLOCK_USER, {
                        user_id: data.user.id,
                        unblocked_user_id: data.unblockedUser.id,
                    });
                }
            },
        });

    const handleClickUnblock = () => {
        unblockUserMutate();
    };

    return (
        <div className="border-t border-dashed border-gray-300 p-2 bg-opacity-40 bg-white flex flex-col items-center justify-center text-gray-600">
            <p className="select-none text-sm">
                {currentChat?.member_to_be_blocked?.member.id !== user?.id
                    ? `${currentChat?.member_to_be_blocked?.member.name} is blocked`
                    : "You are blocked"}{" "}
                and cannot send messages.
            </p>
            {currentChat?.member_to_be_blocked?.member.id !== user?.id && (
                <button
                    className="bg-transparent hover:text-orange-600 font-semibold hover:underline text-sm"
                    onClick={handleClickUnblock}
                >
                    {isUnblockingUser ? "Unblocking..." : "Unblock"}
                </button>
            )}
        </div>
    );
};

export default InputBlocked;
