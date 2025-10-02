// Popover.tsx
import React, { useState, useRef, useEffect } from "react";

interface PopoverProps {
    content: React.ReactNode;
    children: React.ReactNode;
    position?:
        | "top"
        | "bottom"
        | "left"
        | "right"
        | "bottom-right"
        | "top-right"
        | "bottom-left"
        | "top-left";
    hideContent?: boolean;
    hideOnClickChildren?: boolean;
}

const Popover: React.FC<PopoverProps> = ({
    content,
    children,
    position = "bottom",
    hideContent = false,
    hideOnClickChildren = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const togglePopover = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getPositionClasses = () => {
        switch (position) {
            case "top":
                return "bottom-full mb-2 left-1/2 -translate-x-1/2";
            case "left":
                return "right-full mr-2 top-1/2 -translate-y-1/2";
            case "right":
                return "left-full ml-2 top-1/2 -translate-y-1/2";
            case "bottom-right":
                return "top-full mt-2 right-0";
            case "bottom-left":
                return "top-full mt-2 left-0";
            case "top-right":
                return "bottom-full mb-2 right-0";
            case "top-left":
                return "bottom-full mb-2 left-0";
            case "bottom":
            default:
                return "top-full mt-2 left-1/2 -translate-x-1/2";
        }
    };

    return (
        <div className={`relative inline-block`}>
            <div
                ref={triggerRef}
                onClick={(e) => {
                    e.stopPropagation();
                    togglePopover();
                }}
            >
                {children}
            </div>
            {isOpen && !hideContent && (
                <div
                    ref={popoverRef}
                    className={`absolute z-50 bg-white shadow-lg min-w-[150px] ${getPositionClasses()}`}
                    onClick={(e) => {
                        if (hideOnClickChildren) {
                            e.stopPropagation();
                            setIsOpen(false);
                        }
                    }}
                >
                    {content}
                </div>
            )}
        </div>
    );
};

export default Popover;
