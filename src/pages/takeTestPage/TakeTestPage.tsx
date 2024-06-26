import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import { getSubmission, getTest } from "../../services/test";
import { TestItf, SubmissionItf } from "../../types/types";
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
import Button from "../authPage/components/Button";

const TakeTestPage = () => {
    const { testId } = useParams();
    const [status, setStatus] = useState<
        "published" | "opened" | "started" | "ended" | "closed"
    >();
    const [remainingTime, setRemainingTime] = React.useState(100000000);
    const [forbidden, setForbidden] = useState(false);
    const [startTime, setStartTime] = useState(new Date());
    const [withUserAnswers, setWithUserAnswers] = useState(false);
    const closeIntervalRef = useRef<NodeJS.Timer | null>(null);
    const openIntervalRef = useRef<NodeJS.Timer | null>(null);
    const remainingIntervalRef = useRef<NodeJS.Timer | null>(null);

    const {
        isLoading: isLoadingSubmission,
        data: submission,
        refetch: refetchSubmission,
    } = useQuery<SubmissionItf>({
        queryFn: async () => {
            const responseData = await getSubmission(testId!);
            return responseData.submission;
        },
        queryKey: ["test-submission", { test_id: testId }],
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        },
    });

    const {
        isLoading: isLoadingTest,
        data: test,
        refetch: refetchTest,
    } = useQuery<TestItf>({
        queryKey: ["test", testId, { with_user_answers: withUserAnswers }],
        queryFn: async () => {
            const responseData = await getTest(testId!, {
                with_user_answers: withUserAnswers,
            });
            return responseData.test;
        },
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
            if (status !== "started") {
                if (
                    test.status === testStatus.PUBLISHED ||
                    test.status === testStatus.PUBLISHABLE
                ) {
                    setStatus("published");
                }

                if (test.status === testStatus.OPENED) {
                    setStatus("opened");
                }
                if (test.status === testStatus.CLOSED) {
                    setStatus("closed");
                }

                setRemainingTime(test.duration * 60 * 1000);
            }
        }
    }, [test]);

    useEffect(() => {
        if (test) {
            if (status === "published") {
                let timeUntilStart =
                    new Date(test.datetime).getTime() - Date.now();
                if (timeUntilStart > 0 && !openIntervalRef.current) {
                    openIntervalRef.current = setInterval(() => {
                        console.log(timeUntilStart);
                        timeUntilStart -= 1000;
                        if (timeUntilStart <= 0) {
                            setStatus("opened");
                            clearInterval(openIntervalRef.current!);
                        }
                    }, 1000);
                }
            }

            if (
                (status === "opened" || status === "published") &&
                test.close_time
            ) {
                let timeUntilClose =
                    new Date(test.close_time).getTime() - Date.now();
                if (timeUntilClose > 0 && !closeIntervalRef.current) {
                    closeIntervalRef.current = setInterval(() => {
                        console.log(status);
                        timeUntilClose -= 1000;
                        if (timeUntilClose - 1000 <= 0) {
                            setStatus((prev) =>
                                prev !== "started" ? "closed" : prev
                            );
                            clearInterval(closeIntervalRef.current!);
                        }
                    }, 1000);
                }
            }
        }
    }, [status]);

    useEffect(() => {
        if (remainingTime <= 0) {
            setRemainingTime(0);
            if (remainingIntervalRef.current)
                clearInterval(remainingIntervalRef.current);
            setStatus("ended");
        }
    }, [remainingTime]);

    useEffect(() => {
        return () => {
            if (closeIntervalRef.current) {
                clearInterval(closeIntervalRef.current);
            }
            if (openIntervalRef.current) {
                clearInterval(openIntervalRef.current);
            }
            if (remainingIntervalRef.current) {
                clearInterval(remainingIntervalRef.current);
            }
        };
    }, []);

    const handleStartTest = async () => {
        await refetchTest();
        setStatus("started");
        setStartTime(new Date());

        remainingIntervalRef.current = setInterval(() => {
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
                                <Button
                                    size="lg"
                                    disabled={status === "published"}
                                    onClick={handleStartTest}
                                >
                                    Start test
                                </Button>
                            </div>
                        )}
                    {status === "closed" && (
                        <div className="flex justify-center mt-2">
                            <p className="text-xl">Test is closed</p>
                        </div>
                    )}
                    {status === "ended" && (
                        <div className="flex justify-center mt-2">
                            <p className="text-xl">Test is ended</p>
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
                        setStatus("ended");
                    }}
                />
            )}
            {submission && test && !isLoadingSubmission && (
                <Submission
                    submission={submission}
                    test={test}
                    onViewDetail={() => {
                        setWithUserAnswers(true);
                    }}
                />
            )}
        </div>
    );
};

export default TakeTestPage;
