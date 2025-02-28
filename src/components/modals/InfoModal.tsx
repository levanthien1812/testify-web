import React from "react";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "./Modal";
import Button from "../elements/Button";

type InfoModalProps = {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
};

const InfoModal = ({ onClose, children, title }: InfoModalProps) => {
    return (
        <Modal onClose={onClose}>
            <ModalHeader title={title} />
            <ModalBody>{children}</ModalBody>
            <ModalFooter includeCancelBtn={false}>
                <Button onClick={onClose}>Close</Button>
            </ModalFooter>
        </Modal>
    );
};

export default InfoModal;
