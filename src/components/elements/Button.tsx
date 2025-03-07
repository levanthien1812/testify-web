import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    primary?: boolean;
    secondary?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const Button = ({
    children,
    primary = true,
    secondary = true,
    size = "md",
    className,
    type = "button",
    ...props
}: ButtonProps) => {
    return (
        <button
            type={type}
            className={`shadow-sm ${
                primary
                    ? "bg-orange-600 shadow-orange-200 text-white hover:bg-orange-700 active:bg-orange-500"
                    : ""
            } ${
                secondary
                    ? "bg-gray-200 shadow-gray-200 text-gray-500 hover:bg-gray-300 active:bg-gray-300"
                    : ""
            } ${size === "sm" ? "px-4 py-0 text-sm" : ""}${
                size === "md" ? "px-8 py-1" : ""
            }${
                size === "lg" ? "px-12 py-1.5" : ""
            } disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-gray-200 transition-colors duration-150 text-nowrap ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
