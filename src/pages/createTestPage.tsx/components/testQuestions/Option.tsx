import React, { forwardRef, useState } from "react";
import Input from "../../../../components/elements/Input";

interface OptionProps extends React.InputHTMLAttributes<HTMLInputElement> {
    index: number;
    onDelete?: (index: number) => void;
    error?: string;
}

const Option = forwardRef<HTMLInputElement, OptionProps>((props, ref) => {
    const { index, onDelete, error, ...rest } = props;
    const [hover, setHover] = useState<boolean>(false);

    return (
        <div
            className="items-end"
            key={index}
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="flex justify-between">
                <label htmlFor={rest.name} className="text-nowrap">
                    Option {index + 1}:
                </label>
                {hover && (
                    <button
                        type="button"
                        className="text-gray-500 hover:text-orange-600"
                        onClick={() => onDelete && onDelete(index)}
                    >
                        Delete
                    </button>
                )}
            </div>

            <Input min={0} className="grow" ref={ref} {...rest} error={error} />
        </div>
    );
});

export default Option;
