import {
    faCheckCircle,
    faTimes,
    faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { forwardRef } from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    error?: string;
    sizing?: "sm" | "md";
    helperText?: string;
    label?: {
        text: string;
        extraClass?: string;
    };
    displayIcon?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
    const {
        className,
        sizing = "md",
        error = null,
        helperText = null,
        label,
        displayIcon = false,
        ...rest
    } = props;
    return (
        <>
            <div className="flex items-center">
                <input
                    type={displayIcon ? "hidden" : "checkbox"}
                    id={props.name}
                    // checked={props.checked}
                    className={`border border-gray-500 ${
                        sizing === "md" && "w-4 h-4"
                    } ${
                        sizing === "sm" && "w-3 h-3"
                    } focus:border-orange-600 accent-orange-500 flex items-center justify-center rounded-none ${className}`}
                    {...rest}
                    ref={ref}
                />
                {displayIcon && !rest.checked && (
                    <FontAwesomeIcon
                        className="text-red-500"
                        icon={faTimesCircle}
                    />
                )}
                {displayIcon && rest.checked && (
                    <FontAwesomeIcon
                        className="text-green-500"
                        icon={faCheckCircle}
                    />
                )}
                {label && (
                    <label
                        className={`shrink-0 ms-2 ${label.extraClass} ${
                            sizing === "md" && "text-md"
                        } ${sizing === "sm" && "text-sm"} `}
                        htmlFor={props.name}
                    >
                        {label.text}
                        {rest.required && (
                            <span className="text-orange-600 text-md ml-0.5">
                                *
                            </span>
                        )}
                    </label>
                )}
            </div>
            {helperText && (
                <p className="text-end text-gray-500 text-sm mt-1">
                    {helperText}
                </p>
            )}
            {error && (
                <p className="text-end text-orange-600 text-sm italic mt-1 leading-4">
                    {error}
                </p>
            )}
        </>
    );
});

export default Checkbox;
