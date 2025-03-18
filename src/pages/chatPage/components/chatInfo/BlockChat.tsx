import React, { useMemo } from "react";
import Button from "../../../../components/elements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useChatSocket } from "../ChatSocketContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../../stores/rootState";
import { blockUser } from "../../../../services/user";
import { useMutation } from "react-query";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import { SOCKET_EVENTS } from "../../../../config/constants/socket";
import { useDispatch } from "react-redux";
import { authActions } from "../../../../stores/auth";

type BlockChatProps = {
    onClose: () => void;
};

const BlockChat = ({ onClose }: BlockChatProps) => {
    const { currentChat, socket } = useChatSocket();
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const memberToBlock = useMemo(() => {
        return currentChat!.members.find(
            (member) => member.member.id !== user?.id
        )?.member;
    }, [currentChat, user]);

    const { mutate: blockUserMutate, isLoading: isBlockingUser } = useMutation({
        mutationFn: async () => {
            const response = await blockUser(memberToBlock?.id!);
            return response;
        },
        mutationKey: [MUTATION_KEYS.BLOCK_USER],
        onSuccess: (data) => {
            dispatch(authActions.blockUser(data.blockedUserId));
            if (socket) {
                socket.emit(SOCKET_EVENTS.BLOCK_USER, data);
            }
        },
    });

    const handleClickBlock = () => {
        blockUserMutate();
    };

    return (
        <div className="text-sm leading-tight">
            <button
                className="text-gray-400 hover:text-gray-500 hover:underline flex items-center gap-1 text-sm"
                onClick={onClose}
            >
                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                Back
            </button>
            <p className="mt-2">
                You are about to block{" "}
                <span className="font-bold"> {memberToBlock?.name}</span>.
                Blocking will prevent you and this user from:
            </p>
            <ul className="list-disc pl-4">
                <li>Sending each other new messages.</li>
                <li>Seeing each other's messages in direct chats.</li>
            </ul>
            <p className="mt-2">
                Please note: If you are both members of the same group chats,
                you may still see their messages and they may see yours within
                those groups
            </p>
            <p className="text-red-600 mt-2">
                Are you sure you want to proceed?
            </p>
            <Button
                onClick={handleClickBlock}
                className="w-full mt-2 bg-red-600 hover:bg-red-700"
                disabled={isBlockingUser}
            >
                Block {memberToBlock?.name}
            </Button>
        </div>
    );
};

export default BlockChat;
