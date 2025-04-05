import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ErrorInfo = ({
    message,
    extraClass = "",
}: {
    message: string;
    extraClass?: string;
}) => {
    return (
        <p className={`text-orange-600 ${extraClass}`}>
            <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />
            {message}
        </p>
    );
};

export default ErrorInfo;
