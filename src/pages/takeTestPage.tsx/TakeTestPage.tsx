import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import { getTest } from "../../services/test";
import { TestItf } from "../../types/types";
import { format } from "date-fns";
import { AxiosError, HttpStatusCode } from "axios";
import { toast } from "react-toastify";
import DoingTest from "./DoingTest";
import RemainingTime from "./components/RemainingTime";

const TakeTestPage = () => {
    const { testId } = useParams();
    const [startable, setStartable] = React.useState(false);
    const [started, setStarted] = React.useState(false);
    const [remainingTime, setRemainingTime] = React.useState(0);
    const [forbidden, setForbidden] = useState(false);
    const navigate = useNavigate();

    const {
        isLoading,
        data: test,
        refetch,
    } = useQuery<TestItf>({
        queryFn: async () => {
            const responseData = await getTest(testId!);
            return responseData.test;
        },
        queryKey: ["test", testId],
        onError: (error) => {
            if (
                error instanceof AxiosError &&
                error.response?.status === HttpStatusCode.Forbidden
            ) {
                setForbidden(true);
            }
        },
        retry: false,
    });

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (test) {
            setRemainingTime(test.duration * 60);

            timer = setInterval(() => {
                if (
                    new Date(test.datetime).getTime() - new Date().getTime() <=
                    0
                ) {
                    setStartable(true);
                } else {
                    setStartable(false);
                }
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        };
    }, [test]);

    const handleStartTest = async () => {
        await refetch();
        setStarted(true);

        setInterval(() => {
            setRemainingTime((prev) => prev - 1);
        }, 1000);
    };

    return (
        <div className="w-[840px] mx-auto mt-6 bg-white shadow-lg">
            {test && started && (
                <RemainingTime
                    remainingTime={remainingTime}
                    totalTime={test.duration * 60}
                />
            )}
            <div className=" py-8 px-8">
                {!started && test && (
                    <div className="">
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
                            {test.parts.length}
                        </p>

                        <p className="text-xl text-center mt-2">
                            Questions:{" "}
                            <span className=" font-bold text-orange-600 underline"></span>{" "}
                            {test.questions
                                ? test.questions.length
                                : test.parts.reduce(
                                      (acc, part) =>
                                          acc + part.questions!.length,
                                      0
                                  )}
                        </p>

                        <p className="text-xl text-center mt-2">
                            Max score: {test.max_score}
                        </p>

                        {test.level && (
                            <p className="text-xl text-center mt-2">
                                Level:{" "}
                                <span className="capitalize">{test.level}</span>
                            </p>
                        )}

                        <p className="text-xl text-center mt-2">
                            Time begin:{" "}
                            <span className="font-bold px-2 text-orange-600 underline">
                                {format(
                                    new Date(test.datetime),
                                    "dd/MM/yyyy HH:mm"
                                )}
                            </span>
                        </p>

                        {test.description && (
                            <div className="bg-gray-100 px-6 py-4 mt-2">
                                <p className="text-lg">
                                    Description:{" "}
                                    <span className="italic">
                                        {" "}
                                        {test.description}
                                    </span>
                                </p>
                            </div>
                        )}
                        <div className="flex justify-center">
                            <button
                                className="bg-orange-600 text-white py-2 mt-4 px-16 font-bold uppercase hover:bg-orange-700 disabled:bg-gray-600"
                                disabled={!startable}
                                onClick={handleStartTest}
                            >
                                Start test
                            </button>
                        </div>
                    </div>
                )}
                {isLoading && (
                    <p className="text-center text-xl">
                        Loading test's information...
                    </p>
                )}
                {!isLoading && forbidden && (
                    <div className="flex flex-col items-center">
                        <p className="text-center text-xl">
                            You are not allowed to take this test
                        </p>
                        <div className="flex gap-2">
                            <button
                                className="bg-orange-600 text-white mt-4 px-8 py-1"
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </button>
                            <button
                                className="bg-orange-600 text-white mt-4 px-8 py-1"
                                onClick={() => navigate("/home")}
                            >
                                Home
                            </button>
                        </div>
                    </div>
                )}
                {started && test && <DoingTest test={test} />}
            </div>
        </div>
    );
};

export default TakeTestPage;
