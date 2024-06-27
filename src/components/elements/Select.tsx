import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    className?: string;
    sizing?: "sm" | "md";
    options: {
        value: string | number;
        label: string | number;
    }[];
}

const Select = ({
    className,
    options,
    sizing = "md",
    ...props
}: SelectProps) => {
    return (
        <select
            className={`border border-gray-500 ${
                sizing === "sm" && "px-1 py-0"
            } ${
                sizing === "md" && "px-2 py-1"
            } focus:border-orange-600 outline-none ${className}`}
            {...props}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value} className="py-1">
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Select;
