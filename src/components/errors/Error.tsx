import React from "react";
import times from "./../../assets/images/cancel.png";
import Button from "../elements/Button";

type ErrorProps = {
    errorMessage: {
        text: string;
        extraClass?: string;
    };
    actionButton?: {
        text: string;
        onClick: () => void;
        extraClass?: string;
    };
    extraClass?: string;
};

const Error = ({ errorMessage, actionButton, extraClass }: ErrorProps) => {
    return (
        <div
            className={`flex flex-col items-center justify-center space-y-2 py-8 ${extraClass}`}
        >
            <img src={times} alt="error" className="w-20 h-20" />
            <p className="text-lg text-gray-500">{errorMessage.text}</p>
            {actionButton && (
                <Button
                    onClick={actionButton.onClick}
                    className={`${actionButton.extraClass}`}
                >
                    {actionButton.text}
                </Button>
            )}
        </div>
    );
};

export default Error;
