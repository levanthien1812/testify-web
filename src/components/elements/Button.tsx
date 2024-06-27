import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    primary?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const Button = ({
    children,
    primary = true,
    size = "md",
    className,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={`shadow-sm ${
                primary
                    ? "bg-orange-600 shadow-orange-200 hover:bg-orange-700 active:bg-orange-500"
                    : "bg-gray-400 shadow-gray-200 hover:bg-gray-500 active:bg-gray-300"
            } text-white  ${size === "sm" && "px-4 py-0"}
            ${size === "md" && "px-8 py-0.5"}
            ${
                size === "lg" && "px-12 py-1"
            }  disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-gray-200 transition-colors duration-150 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
