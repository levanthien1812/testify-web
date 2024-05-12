import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { motion } from "framer-motion";

const Option: React.FC<{ num: number; value: { text: string }, name: string }> = ({
    num,
    value,
}) => {
    const [hover, setHover] = useState<boolean>(false);

    return (
        <div
            className="flex border border-gray-500 relative"
            key={num}
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <label
                htmlFor={`option${num}`}
                className="text-nowrap px-2 bg-orange-500 text-white"
            >
                Option {num}
            </label>
            <input
                type="text"
                name={`option${num}`}
                id={`option${num}`}
                min={0}
                className="px-2 py-1 w-full focus:border-orange-600 outline-none leading-5"
                value={value.text}
                // onChange={
                //     handleInputChange
                // }
                required
            />
            {hover && (
                <motion.button
                    className="absolute top-0 right-0 bg-gray-200 text-red-500 h-full px-2 flex items-center border-l border-gray-500 hover:bg-gray-300"
                    initial={{ translateX: 20, opacity: 0 }}
                    animate={{ translateX: 0, opacity: 1 }}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </motion.button>
            )}
        </div>
    );
};

export default Option;
