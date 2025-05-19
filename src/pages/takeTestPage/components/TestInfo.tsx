import React from "react";
import { TestItf } from "../../../types/types";
import { format } from "date-fns";
import Checkbox from "../../../components/elements/Checkbox";
import Options from "./Options";
import { TEST_LEVEL } from "../../../config/constants/tests";
import { useAppSelector } from "../../../hooks/hooks";

const TestInfo = () => {
    const { test } = useAppSelector((state) => state.takeTest);
    if (!test) return null;

    return (
        <div>
            <p className="text-center text-[44px]">{test.title}</p>

            <p className="text-xl text-center mt-2">
                Duration:{" "}
                <span className=" font-bold text-orange-600 underline">
                    {test.duration} minutes
                </span>
            </p>

            <p className="text-xl text-center mt-2">
                Parts:{" "}
                <span className=" font-bold text-orange-600 underline"></span>{" "}
                {test.num_parts}
            </p>

            <p className="text-xl text-center mt-2">
                Questions:{" "}
                <span className=" font-bold text-orange-600 underline"></span>{" "}
                {test.num_questions}
            </p>

            <p className="text-xl text-center mt-2">
                Max score: {test.max_score}
            </p>

            {test.level !== TEST_LEVEL.NONE && (
                <p className="text-xl text-center mt-2">
                    Level: <span className="capitalize">{test.level}</span>
                </p>
            )}

            <p className="text-xl text-center mt-2">
                Time start:{" "}
                <span className="font-bold px-2 text-orange-600 underline">
                    {format(new Date(test.datetime), "dd/MM/yyyy HH:mm")}
                </span>
            </p>

            {test.options.allow_close_time.enable && (
                <p className="text-xl text-center mt-2">
                    Time close:{" "}
                    <span className="font-bold px-2 text-orange-600 underline">
                        {format(
                            new Date(test.options.allow_close_time.close_time!),
                            "dd/MM/yyyy HH:mm"
                        )}
                    </span>
                </p>
            )}

            {test.description && (
                <div className="bg-gray-100 px-6 py-4 mt-2">
                    <p className="text-md">
                        Description:{" "}
                        <span className="italic">{test.description}</span>
                    </p>
                </div>
            )}

            {test && <Options />}
        </div>
    );
};

export default TestInfo;
