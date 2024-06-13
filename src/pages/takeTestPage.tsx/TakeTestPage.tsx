import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import { getSubmission, getTest } from "../../services/test";
import { TestItf, TestResultItf } from "../../types/types";
import { format } from "date-fns";
import { AxiosError, HttpStatusCode } from "axios";
import DoingTest from "./DoingTest";
import RemainingTime from "./components/RemainingTime";
import { testStatus } from "../../config/config";
import { toast } from "react-toastify";
import { formatTime } from "../../utils/time";
import TestInfo from "./components/TestInfo";
import Forbidden from "./components/Forbidden";
import Submission from "./components/Submission";

const TakeTestPage = () => {
    const { testId } = useParams();
    const [status, setStatus] = useState<
        "published" | "opened" | "started" | "ended" | "closed"
    >();
    const [remainingTime, setRemainingTime] = React.useState(0);
    const [forbidden, setForbidden] = useState(false);
    const [startTime, setStartTime] = useState(new Date());
    const navigate = useNavigate();

    const {
        isLoading: isLoadingTest,
        data: test,
        refetch: refetchTest,
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

    const {
        isLoading: isLoadingSubmission,
        data: submission,
        refetch: refetchSubmission,
    } = useQuery<TestResultItf>({
        queryFn: async () => {
            const responseData = await getSubmission(testId!);
            return responseData.submission;
        },
        queryKey: ["test_submission", { test_id: testId }],
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        },
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
                        if (status !== "started") setStatus("closed");
                    }
                }, 1000);
            }
        }
    }, [test]);

    useEffect(() => {
        if (remainingTime <= 0) {
            setRemainingTime(0);
            setStatus("ended");
        }
    }, [remainingTime]);

    const handleStartTest = async () => {
        setStatus("started");
        setStartTime(new Date());
        await refetchTest();

        const timer = setInterval(() => {
            setRemainingTime((prev) => prev - 1000);
        }, 1000);
    };

    return (
        <div className="w-[840px] mx-auto mt-6 bg-white shadow-lg">
            {status !== "started" && test && (
                <div className="py-8 px-8">
                    <TestInfo test={test} />
                    {(status === "published" || status === "opened") &&
                        !submission && (
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
            {(isLoadingTest || isLoadingSubmission) && (
                <p className="text-center text-xl py-8 px-8">
                    Loading test's information...
                </p>
            )}
            {!isLoadingTest && forbidden && <Forbidden />}
            {status === "started" && remainingTime >= 0 && test && (
                <DoingTest
                    test={test}
                    remainingTime={remainingTime}
                    startTime={startTime}
                    onAfterSubmit={async () => {
                        await refetchTest();
                        await refetchSubmission();
                    }}
                />
            )}
            {submission && <Submission submission={submission} />}
        </div>
    );
};

export default TakeTestPage;
