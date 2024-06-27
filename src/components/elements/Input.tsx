import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    sizing?: "sm" | "md";
}

const Input = ({ className, sizing = "md", ...props }: InputProps) => {
    return (
        <input
            type={props.type}
            className={`border border-gray-500 ${
                sizing === "md" && "px-2 py-1"
            } ${
                sizing === "sm" && "px-2 py-0"
            } focus:border-orange-600 outline-none placeholder:italic disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
            {...props}
        />
    );
};

export default Input;
