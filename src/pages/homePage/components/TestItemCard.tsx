import { faArrowRight, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TestItf } from "../../../types/types";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import { roles, testStatus } from "../../../config/config";
import Button from "../../../components/elements/Button";

type TestItemCardProps = {
    test: TestItf;
};

const TestItemCard = ({ test }: TestItemCardProps) => {
    const navigate = useNavigate();
    const [hover, setHover] = useState<boolean>(false);
    const user = useSelector((state: RootState) => state.auth.user);

    const handleClickView = () => {
        if (user!.role === roles.MAKER) {
            if (
                test.status === testStatus.DRAFT ||
                test.status === testStatus.PUBLISHABLE
            )
                navigate(`/tests/${test._id}/edit`);
            else navigate(`/tests/${test._id}`);
        } else {
            navigate(`/tests/${test._id}`);
        }
    };

    const statusColor = useMemo(() => {
        switch (test.status) {
            case testStatus.DRAFT:
                return "bg-yellow-500";
            case testStatus.PUBLISHABLE:
                return "bg-cyan-600";
            case testStatus.PUBLISHED:
                return "bg-blue-600";
            case testStatus.OPENED:
                return "bg-green-600";
            case testStatus.CLOSED:
                return "bg-gray-600";
            default:
                return "bg-gray-600";
        }
    }, [test.status]);

    return (
        <div
            className="shadow-md shadow-gray-200 relative overflow-hidden shrink-0 h-full w-full"
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="px-3 py-2 bg-gradient-to-br from-orange-200 to-orange-50 flex items-center justify-between gap-2">
                <p className="text-lg font-bold w-44 overflow-hidden text-ellipsis text-nowrap">
                    {test.title}
                </p>
                <div
                    className={`uppercase text-xs ${statusColor} text-white w-fit px-1`}
                >
                    {test.status}
                </div>
            </div>
            <div className="px-3 py-3">
                {test.num_parts > 1 && (
                    <p>
                        <FontAwesomeIcon
                            className="text-xs text-orange-600 me-2"
                            icon={faStar}
                        />
                        {test.num_parts} parts
                    </p>
                )}
                <p>
                    <FontAwesomeIcon
                        className="text-xs text-orange-600 me-2"
                        icon={faStar}
                    />
                    {test.num_questions} questions
                </p>
                <p>
                    <FontAwesomeIcon
                        className="text-xs text-orange-600 me-2"
                        icon={faStar}
                    />
                    {test.duration} minutes
                </p>
                <p>
                    <FontAwesomeIcon
                        className="text-xs text-orange-600 me-2"
                        icon={faStar}
                    />
                    {format(new Date(test.datetime), "dd/MM/yyyy HH:mm")}
                </p>
                {!!test.submissions_count && (
                    <p className="font-bold text-orange-600">
                        <FontAwesomeIcon
                            className="text-xs text-orange-600 me-2"
                            icon={faStar}
                        />
                        Submissions: {test.submissions_count}
                    </p>
                )}
            </div>

            {hover && (
                <motion.div
                    className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-60 flex justify-center items-center"
                    initial={{
                        rotateX: 30,
                        translateY: 20,
                        scale: 1.2,
                    }}
                    animate={{ rotateX: 0, translateY: 0, scale: 1 }}
                >
                    <Button onClick={handleClickView} className="shadow-none">
                        <span>View detail</span>
                        <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                    </Button>
                </motion.div>
            )}
        </div>
    );
};

export default TestItemCard;
