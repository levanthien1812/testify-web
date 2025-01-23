import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import { getSubmission, getTest } from "../../services/test";
import { SubmissionItf } from "../../types/types";
import DoingTest from "./DoingTest";
import { TEST_STATUS } from "../../config/config";
import TestInfo from "./components/TestInfo";
import Forbidden from "./components/Forbidden";
import Submission from "./components/Submission";
import Button from "../../components/elements/Button";
import { QUERY_KEYS } from "../../config/constants/queryMutationKeys";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/rootState";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../stores/takeTest";
import Loading from "../../components/loadings/Loading";
import { useEffect, useState } from "react";
import Error from "../../components/errors/Error";

const TakeTestPage = () => {
    const { testId } = useParams();
    const {
        testStatus,
        test,
        startable,
        isStarted,
        isEnded,
        isForbidden,
        includeTakerAnswers,
    } = useSelector((state: RootState) => state.takeTest);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        isLoading: isLoadingSubmission,
        data: submission,
        refetch: refetchSubmission,
    } = useQuery<SubmissionItf>({
        queryFn: async () => {
            const responseData = await getSubmission(testId!);
            return responseData.submission;
        },
        queryKey: [QUERY_KEYS.GET_TEST_SUBMISSION, { test_id: testId }],
    });

    const { isLoading: isLoadingTest, refetch: refetchTest } = useQuery({
        queryKey: [
            QUERY_KEYS.GET_TEST,
            testId,
            { with_user_answers: includeTakerAnswers },
        ],
        queryFn: async () => {
            const responseData = await getTest(testId!, {
                with_user_answers: includeTakerAnswers,
            });
            dispatch(takeTestActions.setTest(responseData.test));
        },
        onError: (error: any) => {
            if (error.response?.data?.errorCode) {
                setErrorMessage(error.response?.data?.message);
                // dispatch(takeTestActions.setForbidden(true));
            }
        },
        retry: false,
    });

    const handleStartTest = async () => {
        dispatch(takeTestActions.setIsStarted(true));
        await refetchTest();
    };

    useEffect(() => {
        if (!test || !test.datetime) return;

        const timer = setInterval(() => {
            if (new Date(test.datetime).getTime() - Date.now() >= 0) {
                dispatch(takeTestActions.setStartable(false));
            } else {
                dispatch(takeTestActions.setStartable(true));
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [test, dispatch]);

    return (
        <div className="w-[840px] mx-auto mt-6 bg-white shadow-lg">
            {errorMessage && (
                <Error
                    errorMessage={{ text: errorMessage }}
                    actionButton={{
                        text: "Back to home",
                        onClick: () => {
                            navigate("/home");
                        },
                    }}
                />
            )}
            {!isStarted && test && (
                <div className="py-8 px-8">
                    <TestInfo test={test} />
                    {(test.status === TEST_STATUS.PUBLISHED ||
                        test.status === TEST_STATUS.OPENED) &&
                        !submission && (
                            <div className="flex justify-center mt-4">
                                <Button
                                    size="lg"
                                    disabled={!startable}
                                    onClick={handleStartTest}
                                >
                                    Start test
                                </Button>
                            </div>
                        )}
                    {testStatus === TEST_STATUS.CLOSED && (
                        <div className="flex justify-center mt-2">
                            <p className="text-xl">Test is closed</p>
                        </div>
                    )}
                    {testStatus === "ended" && (
                        <div className="flex justify-center mt-2">
                            <p className="text-xl">Test is ended</p>
                        </div>
                    )}
                </div>
            )}
            {(isLoadingTest || isLoadingSubmission) && (
                <Loading
                    isLoading={isLoadingTest}
                    loadingText={{ text: "Loading test's information..." }}
                />
            )}
            {!isLoadingTest && isForbidden && <Forbidden />}
            {isStarted && !isEnded && test && (
                <DoingTest
                    onAfterSubmit={async () => {
                        await refetchTest();
                        await refetchSubmission();
                    }}
                />
            )}
            {submission && test && !isLoadingSubmission && (
                <Submission submission={submission} />
            )}
        </div>
    );
};

export default TakeTestPage;
