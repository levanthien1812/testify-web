import { faEllipsis, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TestTemplateItf } from "../../../types/testTemplate";
import { format } from "date-fns";
import { ROLES, TEST_LEVEL_LABEL } from "../../../config/constants/tests";
import Button from "../../../components/elements/Button";
import { useAppSelector } from "../../../hooks/hooks";
import IconButton from "../../../components/elements/IconButton";
import Popover from "../../../components/modals/Popover";

type TemplateItemCardProps = {
    template: TestTemplateItf;
};

const TemplateItemCard = ({ template }: TemplateItemCardProps) => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);

    const handleClickView = () => {
        if (user!.role === ROLES.MAKER) {
            navigate(`/test-templates/${template.id}/edit`);
        }
    };

    return (
        <div
            className="px-3 py-3 bg-gradient-to-br from-purple-200 to-purple-50 flex items-center justify-between gap-2 cursor-pointer"
            onClick={handleClickView}
        >
            <p className="text-lg text-ellipsis text-nowrap">{template.name}</p>
            <Popover
                content={
                    <div className="flex flex-col gap-2 p-2">
                        <Button
                            onClick={handleClickView}
                            className="w-full"
                            size="sm"
                        >
                            View Details
                        </Button>
                        <Button onClick={() => {}} className="w-full" size="sm">
                            Delete
                        </Button>
                        <Button onClick={() => {}} className="w-full" size="sm">
                            Generate test
                        </Button>
                    </div>
                }
                children={
                    <FontAwesomeIcon
                        icon={faEllipsis}
                        className={`text-gray-500 cursor-pointer`}
                    />
                }
            />
        </div>
    );
};

export default TemplateItemCard;
