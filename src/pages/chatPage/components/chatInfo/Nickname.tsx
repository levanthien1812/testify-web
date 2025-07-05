import { useState } from "react";
import { UserItf } from "../../../../types/types";
import { faCheck, faPen, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../../../../components/elements/Input";
import { useMutation } from "react-query";
import { updaetNickname } from "../../../../services/chat";
import { useChatSocket } from "../ChatSocketContext";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import { SOCKET_EVENTS } from "../../../../config/constants/socket";

type NicknameProps = {
    member: {
        member: UserItf;
        nick_name: string | null;
    };
};

const Nickname = ({ member }: NicknameProps) => {
    const { currentChat, updateNickname, socket } = useChatSocket();
    const [nickname, setNickname] = useState(
        member.nick_name || member.member.name
    );
    const [isEdittingNickname, setIsEdittingNickname] = useState(false);

    const { mutate: updateChatMutate } = useMutation({
        mutationFn: async () => {
            const response = await updaetNickname(
                currentChat?.id!,
                member.member.id,
                nickname
            );
            return response;
        },
        mutationKey: [MUTATION_KEYS.UPDATE_CHAT],
        onSuccess: (data) => {
            setIsEdittingNickname(false);
            updateNickname(currentChat!.id, member.member.id, nickname);
            if (socket) {
                socket.emit(SOCKET_EVENTS.CHANGE_NICKNAME, {
                    message: data.message,
                    memberId: member.member.id,
                    nickname: nickname,
                });
            }
        },
    });

    const handleUpdateNickname = () => {
        updateChatMutate();
    };

    return (
        <div key={member.member.id} className="flex items-center gap-1">
            <img
                src={member.member.photo}
                alt="user-avatar"
                className="object-cover w-6 h-6 rounded-md shrink-0"
            />
            {!isEdittingNickname && (
                <p className="text-sm">
                    {member.nick_name || member.member.name}
                </p>
            )}
            {isEdittingNickname && (
                <Input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    sizing="sm"
                    className="shrink"
                />
            )}
            {!isEdittingNickname && (
                <button
                    className="w-5 h-5 bg-gray-100 p-1 rounded-md flex justify-center items-center hover:bg-gray-200 shrink-0"
                    onClick={() => setIsEdittingNickname(true)}
                >
                    <FontAwesomeIcon
                        icon={faPen}
                        className="text-gray-600 text-[10px]"
                    />
                </button>
            )}
            {isEdittingNickname && (
                <>
                    <button
                        className="w-5 h-5 bg-gray-100 p-1 rounded-md flex justify-center items-center hover:bg-gray-200 shrink-0"
                        onClick={handleUpdateNickname}
                    >
                        <FontAwesomeIcon
                            icon={faCheck}
                            className="text-gray-600 text-[10px]"
                        />
                    </button>
                    <button
                        className="w-5 h-5 bg-gray-100 p-1 rounded-md flex justify-center items-center hover:bg-gray-200 shrink-0"
                        onClick={() => setIsEdittingNickname(false)}
                    >
                        <FontAwesomeIcon
                            icon={faTimes}
                            className="text-gray-600 text-[10px]"
                        />
                    </button>
                </>
            )}
        </div>
    );
};

export default Nickname;
