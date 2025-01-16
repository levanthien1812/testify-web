import { useQuery } from "react-query";
import { useParams } from "react-router";
import { getSubmission, getTest } from "../../services/test";
import { SubmissionItf } from "../../types/types";
import { AxiosError, HttpStatusCode } from "axios";
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
        onError: (error) => {
            if (
                error instanceof AxiosError &&
                error.response?.status === HttpStatusCode.Forbidden
            ) {
                dispatch(takeTestActions.setForbidden(true));
            }
        },
        enabled: false,
        retry: false,
    });

    const handleStartTest = async () => {
        await refetchTest();
    };

    return (
        <div className="w-[840px] mx-auto mt-6 bg-white shadow-lg">
            {!isStarted && test && (
                <div className="py-8 px-8">
                    <TestInfo test={test} />
                    {(testStatus === TEST_STATUS.PUBLISHED ||
                        testStatus === TEST_STATUS.OPENED) &&
                        !submission && (
                            <div className="flex justify-center">
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
                <p className="text-center text-xl py-8 px-8">
                    Loading test's information...
                </p>
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
