import React from "react";
import { formatTime } from "../../../utils/time";
import { motion } from "framer-motion";

type RemainingTimeProps = {
    remainingTime: number;
    totalTime: number;
};

const RemainingTime = ({ remainingTime, totalTime }: RemainingTimeProps) => {
    const [hover, setHover] = React.useState(false);

    return (
        <motion.div
            className="w-full bg-gray-200"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onMouseOver={(e) => setHover(true)}
            onMouseLeave={(e) => setHover(false)}
        >
            <div
                className="h-full py-0.5 bg-orange-600 text-center text-white"
                style={{ width: `${(remainingTime / totalTime) * 100}%` }}
            >
                {hover && formatTime(remainingTime)}
            </div>
        </motion.div>
    );
};

export default RemainingTime;
