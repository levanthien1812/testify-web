import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import Button from "../elements/Button";
import Backdrop from "./Backdrop";

type ModalProps = {
    children: ReactNode;
    width?: string;
    onClose: () => void;
    allowClickBackdropToClose?: boolean;
};

type HeaderProps = {
    title: string;
};

type BodyProps = {
    children: ReactNode;
};

type FooterProps = {
    includeCancelBtn?: boolean;
    children?: ReactNode;
};

const ModalContext = React.createContext<Pick<ModalProps, "onClose"> | null>(
    null
);

const Modal = ({
    children,
    onClose,
    width,
    allowClickBackdropToClose = true,
}: ModalProps) => {
    const currentZIndex = React.useRef(50);

    React.useEffect(() => {
        currentZIndex.current += 10;
    }, []);

    return createPortal(
        <ModalContext.Provider value={{ onClose }}>
            <Backdrop
                onClick={allowClickBackdropToClose ? onClose : () => {}}
                zIndex={currentZIndex.current - 5}
            />
            {currentZIndex.current && (
                <div
                    className={`fixed top-0 left-0 right-0 bottom-0 bg-white shadow-md mx-2 md:mx-auto my-auto ${
                        width || "w-fit"
                    } h-fit min-w-40 md:min-w-[300px] md:w-1/3 2xl:min-w-[500px] z-50`}
                >
                    {children}
                </div>
            )}
        </ModalContext.Provider>,
        document.getElementById("modal")!
    );
};
export const ModalHeader = ({ title }: HeaderProps) => {
    const props = React.useContext(ModalContext);

    return (
        <div className="flex justify-between px-4 py-2 border-b items-center sticky top-0 bg-white z-[51]">
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
        <div className="px-2 py-2 sm:px-4 sm:py-4 md:max-h-[70vh] overflow-y-scroll">
            {children}
        </div>
    );
};

export const ModalFooter = ({
    children: additionalButtons,
    includeCancelBtn = true,
}: FooterProps) => {
    const props = React.useContext(ModalContext!);

    return (
        <div className="px-4 py-3 gap-3 border-t flex items-center justify-end sticky bottom-0 bg-white z-[51]">
            {includeCancelBtn && (
                <Button secondary type="button" onClick={props?.onClose}>
                    Cancel
                </Button>
            )}
            {additionalButtons}
        </div>
    );
};

export default Modal;
