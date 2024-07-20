import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    error?: string;
    sizing?: "sm" | "md";
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const { className, sizing = "md", error, ...rest } = props;
    return (
        <div className={"grow"}>
            <input
                type={props.type}
                id={props.name}
                className={`border border-gray-500 ${
                    sizing === "md" && "px-2 py-1"
                } ${
                    sizing === "sm" && "px-1 py-0"
                } focus:border-orange-600 outline-none placeholder:italic disabled:bg-gray-100 disabled:cursor-not-allowed w-full file:bg-orange-600 file:border-none file:text-white file:text-sm ${className}`}
                {...rest}
                ref={ref}
            />
            {error && (
                <p className="text-end text-orange-600 text-sm italic mt-1 leading-4">
                    {error}
                </p>
            )}
        </div>
    );
});

export default Input;
