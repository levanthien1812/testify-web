import React, { forwardRef, useState } from "react";
import Input from "../../components/elements/Input";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    labelText: string;
    error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>((props, ref) => {
    const [show, setShow] = useState<boolean>(false);
    const { labelText, error, ...rest } = props;

    return (
        <div className="flex flex-col">
            <div className="mb-1 flex justify-between items-center">
                <label htmlFor={props.name}>{labelText}</label>
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
            <Input {...rest} type={show ? "text" : props.type} ref={ref} />
        </div>
    );
});

export default AuthInput;
