import { faArrowRight, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RecentTestItem = () => {
    const [hover, setHover] = useState<boolean>(false);
    return (
        <div
            className="shadow-md shadow-gray-200 relative overflow-hidden"
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="px-3 py-2 bg-gradient-to-br from-orange-200 to-orange-50 flex items-center gap-2">
                <p className="text-lg font-bold">Listening test 1</p>
                <div className="uppercase text-xs bg-green-600 text-white w-fit rounded-full px-1">
                    Finished
                </div>
            </div>
            <div className="px-3 py-3">
                <p>
                    <FontAwesomeIcon
                        className="text-xs text-orange-600 me-2"
                        icon={faStar}
                    />
                    3 parts
                </p>
                <p>
                    <FontAwesomeIcon
                        className="text-xs text-orange-600 me-2"
                        icon={faStar}
                    />
                    15 questions
                </p>
                <p>
                    <FontAwesomeIcon
                        className="text-xs text-orange-600 me-2"
                        icon={faStar}
                    />
                    20 minutes
                </p>
                <p>
                    <FontAwesomeIcon
                        className="text-xs text-orange-600 me-2"
                        icon={faStar}
                    />
                    20/05/2024 16:30PM
                </p>
            </div>

            {hover && (
                <motion.div
                    className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center"
                    initial={{
                        rotateX: 30,
                        translateY: 20,
                        scale: 1.2,
                    }}
                    animate={{ rotateX: 0, translateY: 0, scale: 1 }}
                >
                    <motion.button
                        className="text-white font-bold text-sm uppercase bg-black py-1 px-3 rounded-full"
                        whileTap={{ scale: 1.1 }}
                    >
                        <span>View detail</span>
                        <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                    </motion.button>
                </motion.div>
            )}
        </div>
    );
};

export default RecentTestItem;
