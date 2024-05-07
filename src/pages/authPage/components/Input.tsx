import React, { Dispatch, SetStateAction, useState } from "react";

const Input: React.FC<{
    labelText: string;
    name: string;
    type?: string;
    value: string;
    error?: string;
    placeholder?: string;
    required?: boolean;
    tabIndex?: number;
    setValue: Dispatch<SetStateAction<string>>;
}> = ({
    labelText,
    name,
    value,
    error,
    setValue,
    tabIndex,
    required = true,
    type = "text",
    placeholder = "",
}) => {
    const [show, setShow] = useState<boolean>(false);

    return (
        <div className="flex flex-col">
            <div className="mb-1 flex justify-between items-center">
                <label htmlFor="password-confirm">{labelText}</label>
                {type === "password" && (
                    <button
                        type="button"
                        className="text-xs hover:underline text-gray-800 font-bold"
                        onClick={() => {
                            setShow(!show);
                        }}
                    >
                        {show ? "HIDE" : "SHOW"}
                    </button>
                )}
            </div>
            <input
                type={type === "password" && show ? "text" : type}
                name={name}
                id={name}
                className="border border-gray-500 px-2 py-1 focus:border-orange-600 outline-none placeholder:italic"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                required={required}
                tabIndex={tabIndex}
                key={name}
            />
            {error && (
                <p className="text-end text-orange-600 text-sm italic mt-1 leading-4">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
