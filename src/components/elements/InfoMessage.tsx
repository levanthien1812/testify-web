import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const InfoMessage = ({
    message,
    extraClass = "",
    type = "info",
}: {
    message: string;
    extraClass?: string;
    type?: "info" | "warning" | "error";
}) => {
    return (
        <p
            className={`italic ${
                type === "info"
                    ? "text-gray-600"
                    : type === "warning"
                    ? "text-yellow-500"
                    : "text-red-500"
            } ${extraClass}`}
        >
            <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />
            {message}
        </p>
    );
};

export default InfoMessage;
