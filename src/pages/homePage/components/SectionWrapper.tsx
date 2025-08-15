import React from "react";
import Button from "../../../components/elements/Button";
import { Link } from "react-router-dom";
import Tooltip from "../../../components/modals/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

type SectionWrapperProps = {
    title: {
        text: string;
        className?: string;
        moreInfo?: React.ReactNode;
    };
    buttons?: [
        {
            text: string;
            onClick: () => void;
            display?: boolean;
            className?: string;
            disabled?: boolean;
        }
    ];
    links?: [
        {
            text: string;
            to: string;
            display?: boolean;
            className?: string;
        }
    ];

    children?: React.ReactNode;
};

const SectionWrapper = ({
    title,
    buttons,
    links,
    children,
}: SectionWrapperProps) => {
    const filteredButtons = buttons
        ? buttons.filter((button) => button.display)
        : [];
    const filteredLinks = links
        ? links.filter((link) => link.display !== false)
        : [];

    return (
        <div>
            <div className="flex justify-between items-end border-b border-dashed border-gray-300 gap-4">
                <div className="flex gap-1">
                    <div className={`text-2xl inline-block ${title.className}`}>
                        {title.text}
                    </div>
                    {title.moreInfo && (
                        <div className="pb-2">
                            <Tooltip content={title.moreInfo}>
                                <FontAwesomeIcon
                                    icon={faExclamationCircle}
                                    className="text-gray-500 hover:text-orange-600 cursor-pointer text-sm"
                                />
                            </Tooltip>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {filteredButtons.length > 0 &&
                        filteredButtons.map((button) => (
                            <Button
                                size="sm"
                                className=""
                                onClick={button.onClick}
                                disabled={button.disabled}
                                type="button"
                                key={button.text}
                            >
                                {button.text}
                            </Button>
                        ))}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    {filteredLinks.length > 0 &&
                        filteredLinks.map((link) => (
                            <Link
                                key={link.text}
                                to={link.to}
                                className={`text-orange-600 hover:underline ${link.className}`}
                            >
                                {link.text}
                            </Link>
                        ))}
                </div>
            </div>

            {children}
        </div>
    );
};

export default SectionWrapper;
