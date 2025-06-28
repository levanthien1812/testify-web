import moment from "moment";
import React, { useState } from "react";
import Button from "../../../components/elements/Button";
import { useNavigate } from "react-router";

type DateCellWrapperProps = {
    value: Date;
    children: JSX.Element;
};

const DateCellWrapper: React.FC<DateCellWrapperProps> = ({
    value,
    children,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const date: Date = value;

    const showButtonCondition = true;
    const isToday = moment().isSame(date, "day");
    const isPastDay = moment().isAfter(date, "day");

    const handleClickAddTest = () => {
        navigate("/tests/create", {
            state: {
                givenDate: date,
            },
        });
    };

    return (
        <div
            className={`relative h-full w-full flex justify-center items-center cursor-pointer border ${
                isToday
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300 bg-white"
            } rounded-md overflow-hidden px-2 py-2`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}

            {isHovered && showButtonCondition && !isPastDay && (
                <Button
                    className="rounded-md"
                    size="sm"
                    onClick={handleClickAddTest}
                >
                    Add Test
                </Button>
            )}
        </div>
    );
};

export default DateCellWrapper;
