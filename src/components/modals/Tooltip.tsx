import React, { useState } from "react";

type TooltipProps = {
    children: React.ReactNode;
    content: React.ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative flex items-center justify-center">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </div>

            {isVisible && (
                <div className="absolute z-10 bottom-full mb-2 flex flex-col items-center min-w-52">
                    <div className="relative px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded-md shadow-lg">
                        {content}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
