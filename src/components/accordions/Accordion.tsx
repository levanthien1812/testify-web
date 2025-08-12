import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import IconButton from "../elements/IconButton";
import Popover from "../modals/Popover";

type viewData = {
    title: {
        text: string;
        extraClass?: string;
        description?: {
            text: string;
        };
    };
    open?: boolean;
    onToggle?: () => void;
    actions?: {
        text: string;
        onClick: () => void;
        disabled?: boolean;
        className?: string;
        display?: boolean;
    }[];
    extraClass?: string;
};

const Accordion = ({
    children,
    viewData,
}: {
    viewData: viewData;
    children: React.ReactNode;
}) => {
    const [open, setOpen] = useState<boolean>(viewData.open || false);

    useEffect(() => {
        setOpen(viewData.open || false);
    }, [viewData.open]);

    return (
        <div className={`border border-gray-300 ${viewData.extraClass}`}>
            <div
                className="flex items-center px-2 py-1 sm:px-4 sm:py-2 bg-gray-300 cursor-pointer gap-2"
                onClick={() => {
                    setOpen((prev) => !prev);
                    if (viewData.onToggle) viewData.onToggle();
                }}
            >
                <p className="text-lg mr-auto flex flex-col lg:flex-row lg:gap-2">
                    <span className={`text-xl ${viewData.title.extraClass}`}>
                        {viewData?.title?.text}
                    </span>
                    <span className="text-gray-500">
                        {viewData?.title?.description?.text}
                    </span>
                </p>

                {viewData.actions && (
                    <div className="relative flex justify-center">
                        <Popover
                            position="bottom"
                            content={viewData.actions
                                .filter((action) => action.display)
                                .map((action, index) => (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            action.onClick();
                                        }}
                                        className={`bg-white text-center px-6 text-nowrap border-none min-w-[30px] w-full text-sm text-gray-700 hover:bg-orange-600 hover:text-white disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-50 ${action.className}`}
                                        type="button"
                                        key={index}
                                        disabled={action.disabled}
                                    >
                                        {action.text}
                                    </button>
                                ))}
                        >
                            <div className="`border-none bg-gray-100 rounded-full flex justify-center items-center hover:bg-gray-200 leading-none w-6 h-6">
                                <FontAwesomeIcon icon={faEllipsis} />
                            </div>
                        </Popover>
                    </div>
                )}

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
