import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import IconButton from "../elements/IconButton";

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
    const [showActions, setShowActions] = useState<boolean>(false);

    useEffect(() => {
        setOpen(viewData.open || false);
    }, [viewData.open]);

    return (
        <div className={`border border-gray-300 ${viewData.extraClass}`}>
            <div
                className="flex items-center px-4 py-2 bg-gray-300 cursor-pointer gap-2"
                onClick={() => {
                    setOpen((prev) => !prev);
                    if (viewData.onToggle) viewData.onToggle();
                }}
            >
                <p className="text-lg space-x-2 mr-auto">
                    <span className={`uppercase ${viewData.title.extraClass}`}>
                        {viewData?.title?.text}
                    </span>
                    <span className="text-gray-500">
                        {viewData?.title?.description?.text}
                    </span>
                </p>

                {viewData.actions && (
                    <div className="relative flex justify-center">
                        <IconButton
                            icon={faEllipsis}
                            onClick={(
                                e: React.MouseEvent<HTMLButtonElement>
                            ) => {
                                e.stopPropagation();
                                setShowActions(!showActions);
                            }}
                        />
                        {showActions && (
                            <div className="absolute top-6 bg-gray-100 z-10 shadow-md shadow-gray-300 px-1">
                                {viewData.actions
                                    .filter((action) => action.display)
                                    .map((action, index) => (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                action.onClick();
                                                setShowActions(false);
                                            }}
                                            className={`bg-white text-center px-6 text-nowrap border-none min-w-[30px] w-full text-sm text-gray-700 hover:bg-orange-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 ${action.className}`}
                                            type="button"
                                            key={index}
                                            disabled={action.disabled}
                                        >
                                            {action.text}
                                        </button>
                                    ))}
                            </div>
                        )}
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
