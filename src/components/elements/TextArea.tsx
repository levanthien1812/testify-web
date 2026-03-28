import React, { forwardRef } from "react";

interface TextAreaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
    error?: string;
    sizing?: "sm" | "md";
    helperText?: string;
    label?: {
        text: string;
        extraClass?: string;
    };
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (props, ref) => {
        const {
            className,
            sizing = "md",
            error = null,
            helperText = null,
            label,
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
                    <textarea
                        id={props.name}
                        className={`${className} border border-gray-500 block ${
                            sizing === "md" && "px-2 py-1 text-md"
                        } ${sizing === "sm" && "px-1 py-0 text-sm"} ${
                            error ? "border-orange-600" : ""
                        } focus:border-orange-600 outline-none placeholder:italic disabled:bg-gray-100 disabled:cursor-not-allowed w-full`}
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
    }
);

export default TextArea;
