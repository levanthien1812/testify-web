import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    error?: string;
    sizing?: "sm" | "md";
    helperText?: string;
    label?: {
        text: string;
        extraClass?: string;
    };
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const {
        className,
        sizing = "md",
        error = null,
        helperText = null,
        label,
        type = "text",
        ...rest
    } = props;
    return (
        <>
            {label && (
                <label
                    className={`shrink-0 ${label.extraClass}`}
                    htmlFor={props.name}
                >
                    {label.text}
                    {rest.required && (
                        <span className="text-orange-600 text-md ml-0.5">
                            *
                        </span>
                    )}
                    :
                </label>
            )}
            <div className={"w-full"}>
                <input
                    type={type}
                    id={props.name}
                    className={`${className} border border-gray-500 ${
                        sizing === "md" && "px-2 py-1 text-md"
                    } ${sizing === "sm" && "px-1 py-0 text-sm"} ${
                        error ? "border-orange-600" : ""
                    } focus:border-orange-600 outline-none placeholder:italic disabled:bg-gray-100 disabled:cursor-not-allowed w-full file:bg-orange-600 file:border-none file:text-white file:text-sm ${
                        type === "file" ? "cursor-pointer" : ""
                    }`}
                    {...rest}
                    ref={ref}
                />
                {helperText && (
                    <p className="text-end text-gray-500 text-sm mt-0.5 italic">
                        {helperText}
                    </p>
                )}
                {error && (
                    <p className="text-end text-orange-600 text-sm italic mt-1 leading-4">
                        {error}
                    </p>
                )}
            </div>
        </>
    );
});

export default Input;
