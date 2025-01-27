import React, { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    className?: string;
    sizing?: "sm" | "md";
    options: {
        value: string | number;
        label: string | number;
    }[];
    guideOption?: string;
    error?: string;
    helperText?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
    const {
        className,
        options,
        sizing = "md",
        guideOption = null,
        error = null,
        helperText = null,
        ...rest
    } = props;

    return (
        <div className="grow w-full">
            <select
                className={`border border-gray-500 ${
                    sizing === "sm" && "px-1 py-0.5"
                } ${
                    sizing === "md" && "px-2 py-1.5"
                } focus:border-orange-600 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed w-full ${className}`}
                ref={ref}
                {...rest}
            >
                {guideOption && (
                    <option value="" hidden>
                        {guideOption}
                    </option>
                )}
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        className="py-1"
                    >
                        {option.label}
                    </option>
                ))}
            </select>
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
        </div>
    );
});

export default Select;
