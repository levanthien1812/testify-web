import React, { useState } from "react";
import Input from "../../components/elements/Input";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    labelText: string;
    error?: string;
}

const AuthInput = ({ labelText, error, ...props }: AuthInputProps) => {
    const [show, setShow] = useState<boolean>(false);

    return (
        <div className="flex flex-col">
            <div className="mb-1 flex justify-between items-center">
                <label htmlFor="password-confirm">{labelText}</label>
                {props.type === "password" && (
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
            <Input {...props} type={props.type} />
            {error && (
                <p className="text-end text-orange-600 text-sm italic mt-1 leading-4">
                    {error}
                </p>
            )}
        </div>
    );
};

export default AuthInput;
