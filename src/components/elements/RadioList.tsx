import React, { forwardRef } from "react";

interface RadioListProps {
    name: string;
    options: {
        value: string | number;
        label: string;
    }[];
    selectedValue: string | number | null;
    onChange: (value: string | number) => void;
    error?: string;
    sizing?: "sm" | "md";
    helperText?: string;
    className?: string;
}

const RadioList = ({
    name,
    options,
    selectedValue,
    onChange,
    error,
    helperText,
    className = "",
}: RadioListProps) => {
    return (
        <div className={"w-full mt-2"}>
            <div className={`flex gap-4 ${className}`}>
                {options.map((option) => (
                    <div key={option.value} className="flex items-center">
                        <input
                            type="radio"
                            id={`${option.value}`}
                            name={name}
                            value={option.value}
                            checked={
                                selectedValue !== undefined
                                    ? selectedValue === option.value
                                    : false
                            }
                            onChange={() => onChange(option.value)}
                            className="text-orange-600 focus:ring-orange-500 border-gray-300"
                        />
                        <label htmlFor={`${option.value}`} className="ml-1">
                            {option.label}
                        </label>
                    </div>
                ))}
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
        </div>
    );
};

export default RadioList;
