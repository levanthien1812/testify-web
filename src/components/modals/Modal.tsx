import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { createPortal } from "react-dom";

const Modal: React.FC<{
    title: string;
    children: JSX.Element | JSX.Element[] | string;
    onClose?: () => void;
}> = ({ children, title, onClose }) => {
    return createPortal(
        <>
            <div className="absolute top-0 left-0 right-0 bottom-0 m-auto bg-black bg-opacity-15 shadow-md w-full h-full"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 m-auto bg-white shadow-md w-1/4 h-fit">
                <div className="flex justify-between px-4 py-2 border-b items-center">
                    <p className="text-2xl">{title}</p>
                    <button
                        className="bg-gray-200 hover:bg-gray-300 w-5 h-5 flex justify-center items-center"
                        onClick={onClose}
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-sm" />
                    </button>
                </div>
                <div className="px-4 py-3">{children}</div>
            </div>
        </>,
        document.getElementById("modal")!
    );
};

export default Modal;
