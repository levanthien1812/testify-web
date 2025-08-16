import React from "react";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../../components/modals/Modal";
import AIInputMessage from "../../../chatPage/components/selectedAIChat/AIInputMessage";
import AIMessages from "../../../chatPage/components/selectedAIChat/AIMessages";

type AIAssistantProps = {
    message: string;
    onClose: () => void;
};

const AIAssistant = ({ message, onClose }: AIAssistantProps) => {
    return (
        <Modal onClose={onClose} width="md:w-1/2">
            <ModalHeader title="AI Assistant" />
            <ModalBody>
                <AIMessages />
                <AIInputMessage initialMessage={message} />
            </ModalBody>
            <ModalFooter />
        </Modal>
    );
};

export default AIAssistant;
