import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import { getSubmissions, getTest } from "../../services/test";
import { PasscodeItf, SubmissionItf } from "../../types/types";
import DoingTest from "./DoingTest";
import { SHARE_OPTIONS, TEST_STATUS } from "../../config/constants/tests";
import TestInfo from "./components/TestInfo";
import Forbidden from "./components/Forbidden";
import Button from "../../components/elements/Button";
import { QUERY_KEYS } from "../../config/constants/queryMutationKeys";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../stores/takeTest";
import Loading from "../../components/loadings/Loading";
import { useEffect, useMemo, useState } from "react";
import Error from "../../components/errors/Error";
import PasscodeLink from "../createTestPage/components/testTakers/PasscodeLink";
import Submissions from "./components/Submissions";
import { useAppSelector } from "../../hooks/hooks";
import { ERROR_CODE } from "../../config/constants/errorCode";

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
        isEnteringPasscode,
        isPasscodeValidated,
        submissions,
        enteredPasscode,
        submissionsCount,
    } = useAppSelector((state) => state.takeTest);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { isLoading: isLoadingTest, refetch: refetchTest } = useQuery({
        queryKey: [
            QUERY_KEYS.GET_TEST,
            testId,
            { with_user_answers: includeTakerAnswers, started: isStarted },
        ],
        queryFn: async () => {
            const responseData = await getTest(testId!, {
                with_user_answers: includeTakerAnswers,
                ...(enteredPasscode ? { passcode: enteredPasscode } : {}),
                ...(isStarted ? { started: true } : {}),
            });

            return responseData;
        },
        onError: (error: any) => {
            if (
                error.response?.data?.errorCode === ERROR_CODE.PASSCODE_REQUIRED
            ) {
                dispatch(takeTestActions.setIsEnteringPasscode(true));
            }
        },
        onSuccess: (data: any) => {
            dispatch(takeTestActions.setTest(data));
            if (data?.test.options.allow_view_submission_after_test.enable) {
                refetchSubmissions();
            }
        },
        retry: false,
    });

    const { isLoading: isLoadingSubmissions, refetch: refetchSubmissions } =
        useQuery<SubmissionItf[]>({
            queryFn: async () => {
                const responseData = await getSubmissions(testId!);
                return responseData.submissions;
            },
            queryKey: [QUERY_KEYS.GET_TEST_SUBMISSION, { test_id: testId }],
            enabled: false,
            onSuccess: (data) => {
                dispatch(takeTestActions.setSubmissions(data));
            },
            onError: () => {},
        });

    const handleStartTest = () => {
        dispatch(takeTestActions.setIsStarted(true));
        setTimeout(() => {
            refetchTest();
        }, 0);
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

        return () => {
            clearInterval(timer);
            // dispatch(takeTestActions.reset());
        };
    }, [test, dispatch]);

    useEffect(() => {
        if (isPasscodeValidated && enteredPasscode.length > 0) {
            refetchTest();
        }
    }, [enteredPasscode, isPasscodeValidated, refetchSubmissions, refetchTest]);

    const handleEnterCorrectPasscode = (data: PasscodeItf) => {
        dispatch(takeTestActions.setIsPasscodeValidated(true));
        dispatch(takeTestActions.setIsEnteringPasscode(false));
        dispatch(takeTestActions.setEnteredPasscode(data.code));
    };

    const canEnterDoingTest = useMemo(() => {
        if (!test) return false;

        const isValidParts =
            test && test.num_parts > 1 && test.parts.length > 1;
        const isValidQuestions =
            test &&
            test.num_parts <= 1 &&
            test.questions &&
            test.questions.length > 0;
        return isStarted && !isEnded && (isValidParts || isValidQuestions);
    }, [test, isStarted, isEnded]);

    return (
        <div className="w-[840px] mx-auto mt-6 bg-white shadow-lg">
            {isEnteringPasscode && (
                <PasscodeLink
                    passCodeOnly={true}
                    onClose={() =>
                        dispatch(takeTestActions.setIsEnteringPasscode(false))
                    }
                    onSuccess={handleEnterCorrectPasscode}
                />
            )}
            {errorMessage && (
                <Error
                    errorMessage={{ text: errorMessage }}
                    actionButton={{
                        text: "Back to home",
                        onClick: () => {
                            navigate("/");
                        },
                    }}
                />
            )}
            {!isStarted && test && (
                <div className="py-8 px-8">
                    <TestInfo />
                    {(test.status === TEST_STATUS.PUBLISHED ||
                        test.status === TEST_STATUS.OPENED) &&
                        (test.options.allow_multiple_submissions.enable
                            ? submissions.length <
                              test.options.allow_multiple_submissions
                                  .maximum_submissions!
                            : submissionsCount === 0) && (
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
                    {/* {testStatus === TEST_STATUS.ENDED && (
                        <div className="flex justify-center mt-2">
                            <p className="text-xl">Test is ended</p>
                        </div>
                    )} */}
                </div>
            )}
            {(isLoadingTest || isLoadingSubmissions) && (
                <Loading
                    isLoading={isLoadingTest}
                    loadingText={{ text: "Loading test's information..." }}
                />
            )}
            {!isLoadingTest && isForbidden && <Forbidden />}
            {canEnterDoingTest && (
                <DoingTest
                    onAfterSubmit={async () => {
                        dispatch(takeTestActions.setIsStarted(false));
                        setTimeout(() => {
                            refetchTest();
                        }, 0);
                    }}
                />
            )}
            {submissions.length > 0 &&
                !isStarted &&
                test?.options.allow_view_submission_after_test.enable && (
                    <Submissions />
                )}
        </div>
    );
};

export default TakeTestPage;
