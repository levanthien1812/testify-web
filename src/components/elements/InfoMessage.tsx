import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
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
            className={`italic mt-1 ${
                type === "info"
                    ? "text-gray-600"
                    : type === "warning"
                    ? "text-yellow-500"
                    : "text-red-500"
            } ${extraClass}`}
        >
            <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
            {message}
        </p>
    );
};

export default InfoMessage;
