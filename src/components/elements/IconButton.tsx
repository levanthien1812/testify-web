import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type IconButtonProps = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    icon: IconProp;
    type?: "button" | "submit" | "reset";
    size?: "sm" | "md" | "lg";
    className?: string;
    disabled?: boolean;
};

const IconButton = ({
    onClick,
    icon,
    type = "button",
    size = "md",
    className = "text-gray-400 hover:text-orange-600",
    disabled = false,
}: IconButtonProps) => {
    return (
        <button
            className={`border-none bg-gray-100 rounded-xl ${
                size === "sm"
                    ? "w-4 h-4"
                    : size === "md"
                    ? "w-6 h-6"
                    : "w-8 h-8"
            } flex justify-center items-center hover:bg-gray-200 leading-none disabled:cursor-not-allowed disabled:opacity-50`}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            <FontAwesomeIcon
                icon={icon}
                className={`${
                    size === "sm"
                        ? "text-xs"
                        : size === "md"
                        ? "text-sm"
                        : "text-base"
                } ${className}`}
            />
        </button>
    );
};

export default IconButton;
