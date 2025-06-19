import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type IconButtonProps = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    icon: IconProp;
    type?: "button" | "submit" | "reset";
};

const IconButton = ({ onClick, icon, type = "button" }: IconButtonProps) => {
    return (
        <button
            className="border-none bg-gray-100 rounded-xl w-6 h-6 flex justify-center items-center hover:bg-gray-200"
            onClick={onClick}
            type={type}
        >
            <FontAwesomeIcon
                icon={icon}
                className="text-sm text-gray-400 hover:text-orange-600"
            />
        </button>
    );
};

export default IconButton;
