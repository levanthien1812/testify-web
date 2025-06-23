import React from "react";
import noData from "./../../assets/images/no-data.png";
import Button from "../elements/Button";

type NoResultProps = {
    message?: {
        text: string;
        className?: string;
    };
    description?: {
        text: string;
        className?: string;
    };
    actions?: {
        text: string;
        className?: string;
        onClick: () => void;
    }[];
};

const NoResult = ({ message, description, actions }: NoResultProps) => {
    return (
        <div className="flex flex-col items-center justify-center w-full py-8">
            <img src={noData} alt="no-data" className="w-36 h-36" />
            <p className="text-gray-600 text-xl mt-2">
                {message ? message.text : "No result found!"}
            </p>
            {description && (
                <p
                    className={`text-gray-500 text-sm mt-2 ${
                        description.className || ""
                    }`}
                >
                    {description.text}
                </p>
            )}
            {actions && actions.length > 0 && (
                <div className="flex gap-2 mt-4">
                    {" "}
                    {actions.map((action, index) => (
                        <Button
                            onClick={action.onClick}
                            key={index}
                            primary
                            className={`${action.className || ""}`}
                        >
                            {action.text}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NoResult;
