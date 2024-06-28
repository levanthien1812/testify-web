import React from "react";

type BackdropProps = {
    onClose: () => void;
};

const Backdrop = ({ onClose }: BackdropProps) => {
    return (
        <div
            className={`absolute top-0 left-0 right-0 bottom-0 m-auto bg-black bg-opacity-15 shadow-md w-full h-full`}
            onClick={onClose}
        ></div>
    );
};

export default Backdrop;
