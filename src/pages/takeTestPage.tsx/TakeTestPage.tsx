import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import { getTest } from "../../services/test";
import { TestItf } from "../../types/types";
import { format } from "date-fns";
import { AxiosError, HttpStatusCode } from "axios";
import DoingTest from "./DoingTest";
import RemainingTime from "./components/RemainingTime";
import { testStatus } from "../../config/config";

const TakeTestPage = () => {
    const { testId } = useParams();
    const [status, setStatus] = useState<
        "published" | "opened" | "started" | "ended" | "closed"
    >();
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
        if (test) {
            if (test.status === testStatus.PUBLISHED) {
                setStatus("published");
                let timeUntilStart =
                    new Date(test.datetime).getTime() - Date.now();
                console.log(timeUntilStart);

                let timer = setInterval(() => {
                    timeUntilStart = timeUntilStart - 1000;
                    if (timeUntilStart <= 0) {
                        clearInterval(timer);
                        setStatus("opened");
                    }
                }, 1000);
            }

            if (test.status === testStatus.OPENED) {
                setStatus("opened");
            }
            if (test.status === testStatus.CLOSED) {
                setStatus("closed");
            }

            setRemainingTime(test.duration * 60 * 1000);
            if (test.close_time) {
                let timeUntilClose =
                    new Date(test.close_time).getTime() - Date.now();

                let timer = setInterval(() => {
                    timeUntilClose = timeUntilClose - 1000;
                    if (timeUntilClose <= 0) {
                        clearInterval(timer);
                        setStatus("closed");
                    }
                }, 1000);
            }
        }
    }, [test]);

    useEffect(() => {
        console.log(remainingTime)
        if (remainingTime <= 0) {
            setRemainingTime(0);
            setStatus("ended");
        }
    }, [remainingTime]);

    const handleStartTest = async () => {
        await refetch();
        setStatus("started");

        const timer = setInterval(() => {
            setRemainingTime((prev) => prev - 1000);

            // let newRemainingTime = remainingTime - 1000;
            // if (newRemainingTime <= 0) {
            //     setRemainingTime(0);
            //     clearInterval(timer);
            //     setStatus("ended");
            // }
        }, 1000);
    };

    return (
        <div className="w-[840px] mx-auto mt-6 bg-white shadow-lg">
            {test && status === "started" && (
                <RemainingTime
                    remainingTime={remainingTime}
                    totalTime={test.duration * 60 * 1000}
                />
            )}
            <div className=" py-8 px-8">
                {status !== "started" && test && (
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
                        {(status === "published" || status === "opened") && (
                            <div className="flex justify-center">
                                <button
                                    className="bg-orange-600 text-white py-2 mt-4 px-16 font-bold uppercase hover:bg-orange-700 disabled:bg-gray-600"
                                    disabled={status === "published"}
                                    onClick={handleStartTest}
                                >
                                    Start test
                                </button>
                            </div>
                        )}
                        {status === "closed" && (
                            <div className="flex justify-center mt-2">
                                <p className="text-xl">Test is closed</p>
                            </div>
                        )}
                        {status === "ended" && (
                            <div className="flex justify-center mt-2">
                                <p>Test is ended</p>
                            </div>
                        )}
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
                {status === "started" && remainingTime >= 0 && test && (
                    <DoingTest test={test} remainingTime={remainingTime} />
                )}
            </div>
        </div>
    );
};

export default TakeTestPage;
