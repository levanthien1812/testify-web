import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import Button from "../elements/Button";
import Backdrop from "./Backdrop";

type ModalProps = {
    children: ReactNode;
    className?: string;
    onClose: () => void;
};

type HeaderProps = {
    title: string;
};

type BodyProps = {
    children: ReactNode;
};

type FooterProps = {
    children?: ReactNode;
};

const ModalContext = React.createContext<Pick<ModalProps, "onClose"> | null>(
    null
);

const Modal = ({ children, onClose, className }: ModalProps) => {
    return createPortal(
        <ModalContext.Provider value={{ onClose }}>
            <Backdrop onClose={onClose} />
            <div
                className={`absolute top-0 left-0 right-0 bottom-0 m-auto bg-white shadow-md w-fit h-fit min-w-40 md:min-w-80 2xl:min-w-[500px] ${className}`}
            >
                {children}
            </div>
        </ModalContext.Provider>,
        document.getElementById("modal")!
    );
};
export const ModalHeader = ({ title }: HeaderProps) => {
    const props = React.useContext(ModalContext);

    return (
        <div className="flex justify-between px-4 py-2 border-b items-center">
            <p className="text-2xl">{title}</p>
            <button
                className="bg-gray-200 hover:bg-gray-300 w-5 h-5 flex justify-center items-center"
                onClick={props?.onClose}
            >
                <FontAwesomeIcon icon={faTimes} className="text-sm" />
            </button>
        </div>
    );
};

export const ModalBody = ({ children }: BodyProps) => {
    return (
        <div className="px-4 py-6 max-h-[70vh] overflow-y-scroll">
            {children}
        </div>
    );
};

export const ModalFooter = ({ children: additionalButtons }: FooterProps) => {
    const props = React.useContext(ModalContext!);

    return (
        <div className="px-4 py-3 gap-3 border-t flex items-center justify-end">
            <Button primary={false} type="button" onClick={props?.onClose}>
                Cancel
            </Button>
            {additionalButtons}
        </div>
    );
};

export default Modal;
