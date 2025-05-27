import React from "react";
import { AIChatItf, UpdateAIChat } from "../../../../types/chat";
import { useChatSocket } from "../ChatSocketContext";
import IconButton from "../../../../components/elements/IconButton";
import {
    faEllipsis,
    faPen,
    faThumbTack,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "react-query";
import { updateChatAI } from "../../../../services/chat";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../../components/modals/Modal";
import Input from "../../../../components/elements/Input";
import Button from "../../../../components/elements/Button";

type AIChatCardProps = {
    aiChat: AIChatItf;
};

type ActionButtonProps = {
    icon: any;
    text: string;
    onClick: () => void;
};

const ActionButton = ({ icon, text, onClick }: ActionButtonProps) => {
    return (
        <button
            className="bg-white hover:bg-gray-100 px-4 py-1 space-x-2 text-start flex items-center hover:text-orange-600"
            onClick={onClick}
        >
            <FontAwesomeIcon className="text-gray-600 w-5" icon={icon} />
            <span>{text}</span>
        </button>
    );
};

const AIChatCard = ({ aiChat }: AIChatCardProps) => {
    const { currentAIChat, setCurrentAIChat, updateAIChat } = useChatSocket();
    const [isActionsOpen, setIsActionsOpen] = React.useState(false);
    const [isUpdatingChatName, setIsUpdatingChatName] = React.useState(false);
    const [updatedChatname, setUpdatedChatname] = React.useState(
        aiChat.chat_name
    );

    const handleClickCard = () => {
        if (currentAIChat?.id === aiChat.id) return;
        setCurrentAIChat({
            ...aiChat,
            messages: aiChat.messages || [],
        });
    };

    const { mutate: updateChatMutate } = useMutation({
        mutationFn: async (chatBody: UpdateAIChat) => {
            const responseData = await updateChatAI(aiChat.id!, chatBody);
            return responseData;
        },
        mutationKey: MUTATION_KEYS.UPDATE_CHAT_AI,
        onSuccess: (data: any) => {
            updateAIChat(aiChat.id!, { ...data });
        },
    });

    const handleClickPin = () => {
        setIsActionsOpen(false);
        updateChatMutate({
            is_pinned: !aiChat.is_pinned,
        });
    };

    const handleClickRename = () => {
        setIsActionsOpen(false);
        setIsUpdatingChatName(true);
    };

    const handleClickDelete = () => {};

    return (
        <div
            className={`flex items-center p-2 ${
                currentAIChat?.id === aiChat.id
                    ? "bg-orange-100"
                    : "bg-slate-100"
            } shadow-md gap-2 hover:bg-slate-200 cursor-pointer max-w-full relative`}
            onClick={handleClickCard}
        >
            <p className="whitespace-nowrap overflow-hidden text-ellipsis mr-auto">
                {aiChat.chat_name}
            </p>
            {aiChat.is_pinned && (
                <FontAwesomeIcon
                    className="text-orange-600"
                    icon={faThumbTack}
                />
            )}
            <IconButton
                icon={faEllipsis}
                onClick={() => {
                    setIsActionsOpen(!isActionsOpen);
                }}
            />
            {isActionsOpen && (
                <div
                    className="absolute flex flex-col  top-10 bg-white shadow-md z-10 right-0"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ActionButton
                        icon={!aiChat.is_pinned ? faThumbTack : faThumbTack}
                        text={!aiChat.is_pinned ? "Pin" : "Unpin"}
                        onClick={handleClickPin}
                    />
                    <ActionButton
                        icon={faPen}
                        text="Rename"
                        onClick={handleClickRename}
                    />
                    <ActionButton
                        icon={faTrash}
                        text="Delete"
                        onClick={handleClickDelete}
                    />
                </div>
            )}
            {isUpdatingChatName && (
                <Modal
                    onClose={() => {
                        setIsUpdatingChatName(false);
                    }}
                >
                    <ModalHeader title="Rename Chat" />
                    <ModalBody>
                        <Input
                            value={updatedChatname}
                            onChange={(e) => {
                                setUpdatedChatname(e.target.value);
                            }}
                            label={{ text: "New chat name" }}
                        />
                    </ModalBody>
                    <ModalFooter includeCancelBtn={true}>
                        <Button
                            onClick={() => {
                                updateChatMutate({
                                    chat_name: updatedChatname,
                                });
                                setIsUpdatingChatName(false);
                            }}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </div>
    );
};

export default AIChatCard;
