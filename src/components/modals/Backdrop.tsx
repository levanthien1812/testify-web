import React from "react";

type BackdropProps = {
    onClick: () => void;
};

const Backdrop = ({ onClick }: BackdropProps) => {
    return (
        <div
            className={`fixed top-0 left-0 right-0 bottom-0 m-auto bg-black bg-opacity-15 shadow-md w-full h-full`}
            onClick={onClick}
        ></div>
    );
};

export default Backdrop;
