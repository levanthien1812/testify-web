import React from "react";
import { TestItf } from "../../../types/types";
import { format } from "date-fns";

type TestInfoProps = {
    test: TestItf;
};

const TestInfo = ({ test }: TestInfoProps) => {
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

            {test.level && (
                <p className="text-xl text-center mt-2">
                    Level: <span className="capitalize">{test.level}</span>
                </p>
            )}

            <p className="text-xl text-center mt-2">
                Time begin:{" "}
                <span className="font-bold px-2 text-orange-600 underline">
                    {format(new Date(test.datetime), "dd/MM/yyyy HH:mm")}
                </span>
            </p>

            {test.description && (
                <div className="bg-gray-100 px-6 py-4 mt-2">
                    <p className="text-lg">
                        Description:{" "}
                        <span className="italic"> {test.description}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default TestInfo;
