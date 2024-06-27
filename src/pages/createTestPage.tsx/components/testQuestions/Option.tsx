import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useState } from "react";
import { motion } from "framer-motion";
import Input from "../../../../components/elements/Input";

const Option: React.FC<{
    index: number;
    value: { text: string };
    name: string;
    onInputChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onDelete?: (index: number) => void;
}> = ({ index, value, name, onInputChange, onDelete }) => {
    const [hover, setHover] = useState<boolean>(false);

    return (
        <div
            className="flex border border-gray-500 relative"
            key={index}
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <label
                htmlFor={name}
                className="text-nowrap px-2 bg-orange-500 text-white"
            >
                Option {index + 1}
            </label>
            <Input
                type="text"
                name={name}
                id={name}
                min={0}
                className="w-full border-none"
                value={value.text}
                onChange={onInputChange}
                required
            />
            {hover && (
                <motion.button
                    className="absolute top-0 right-0 bg-gray-200 text-red-500 h-full px-2 flex items-center border-l border-gray-500 hover:bg-gray-300"
                    initial={{ translateX: 20, opacity: 0 }}
                    animate={{ translateX: 0, opacity: 1 }}
                    onClick={() => onDelete && onDelete(index)}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </motion.button>
            )}
        </div>
    );
};

export default Option;
