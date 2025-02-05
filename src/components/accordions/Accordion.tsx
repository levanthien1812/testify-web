import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

type viewData = {
    title: {
        text: string;
        extraClass?: string;
        description?: {
            text: string;
        };
    };
    extraClass?: string;
};

const Accordion = ({
    children,
    viewData,
}: {
    children: React.ReactNode;
    viewData: viewData;
}) => {
    const [open, setOpen] = useState<boolean>(true);

    return (
        <div className={`border border-gray-300 ${viewData.extraClass}`}>
            <div
                className="flex justify-between items-center px-4 py-2 bg-gray-300 cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
            >
                <p className="text-lg space-x-2">
                    <span className={`uppercase ${viewData.title.extraClass}`}>
                        {viewData?.title?.text}
                    </span>
                    <span className="text-gray-500">
                        {viewData?.title?.description?.text}
                    </span>
                </p>
                <FontAwesomeIcon
                    icon={faChevronRight}
                    className={`text-sm transition-all ${
                        open ? "rotate-90" : "rotate-0"
                    }`}
                />
            </div>
            {open && children}
        </div>
    );
};

export default Accordion;
