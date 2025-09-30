import React from "react";
import { AIChatItf, UpdateAIChat } from "../../../../types/chat";
import { useChatSocket } from "../ChatSocketContext";
import {
    faEllipsis,
    faPen,
    faThumbTack,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "react-query";
import { deleteChatAI, updateChatAI } from "../../../../services/chat";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../../components/modals/Modal";
import Input from "../../../../components/elements/Input";
import Button from "../../../../components/elements/Button";
import Popover from "../../../../components/modals/Popover";

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
    const {
        currentAIChat,
        setCurrentAIChat,
        updateAIChat,
        setAIChats,
        setPinnedAIChat,
    } = useChatSocket();
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
    });

    const { mutate: deleteChatMutate } = useMutation({
        mutationFn: async () => {
            await deleteChatAI(aiChat.id!);
        },
        mutationKey: MUTATION_KEYS.DELETE_CHAT_AI,
    });

    const handleClickPin = () => {
        const updatedPinned = !aiChat.is_pinned;
        updateChatMutate({
            is_pinned: updatedPinned,
        });

        setPinnedAIChat(aiChat.id!, updatedPinned);
    };

    const handleClickRename = () => {
        setIsUpdatingChatName(true);
    };

    const handleSaveRename = () => {
        updateChatMutate({
            chat_name: updatedChatname,
        });
        setIsUpdatingChatName(false);
        setCurrentAIChat(
            (prev) => ({ ...prev, chat_name: updatedChatname } as AIChatItf)
        );
        updateAIChat(currentAIChat!.id!, { chat_name: updatedChatname });
    };

    const handleClickDelete = () => {
        deleteChatMutate();
        setAIChats((prev) => prev.filter((chat) => chat.id !== aiChat.id));
        if (currentAIChat && currentAIChat.id === aiChat.id) {
            setCurrentAIChat(null);
        }
    };

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
            <Popover
                content={
                    <div className="flex flex-col bg-white shadow-md">
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
                }
                hideOnClickChildren
            >
                <FontAwesomeIcon icon={faEllipsis} />
            </Popover>
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
                        <Button onClick={handleSaveRename}>Save</Button>
                    </ModalFooter>
                </Modal>
            )}
        </div>
    );
};

export default AIChatCard;
