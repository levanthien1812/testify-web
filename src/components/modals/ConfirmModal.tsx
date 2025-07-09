import React from "react";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "./Modal";
import Button from "../elements/Button";

type ConfirmModalProps = {
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
    isConfirming?: boolean;
    actionText?: string;
};

const ConfirmModal = ({
    message,
    onConfirm,
    onClose,
    isConfirming,
    title,
    actionText = "Confirm",
}: ConfirmModalProps) => {
    return (
        <Modal onClose={onClose}>
            <ModalHeader title={title} />
            <ModalBody>
                <div>{message}</div>
            </ModalBody>
            <ModalFooter>
                <Button disabled={isConfirming} onClick={onConfirm}>
                    {!isConfirming ? actionText : "Confirming..."}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ConfirmModal;
