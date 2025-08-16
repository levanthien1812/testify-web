import { TestItf, SubmissionItf } from "../../types/types";
import { useQuery } from "react-query";
import {
    getQuestionsResultForTest,
    getSubmissions,
    getTest,
} from "../../services/test";
import { useNavigate, useParams } from "react-router";
import SubmissionsTable from "./components/SubmissionsTable";
import { useMemo, useRef, useState } from "react";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../components/modals/Modal";
import TestQuestionsAndAnswers from "../takeTestPage/components/TestQuestionsAndAnswers";
import TestAnswers from "../createTestPage/components/TestAnswers";
import Button from "../../components/elements/Button";
import { viewTestActions } from "../../stores/viewTest";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { QUERY_KEYS } from "../../config/constants/queryMutationKeys";
import { useAppSelector } from "../../hooks/hooks";
import TestInfo from "./components/TestInfo";
import ScoreRangeBarChart from "./components/ScoreRangeBarChart";
import { QuestionResult, TestResult } from "../../types/tests";
import QuestionsResultChart from "./components/QuestionsResultChart";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    defaults,
} from "chart.js";
import Loading from "../../components/loadings/Loading";
import MessageAction from "../others/MessageAction";
import { AxiosError } from "axios";
import TopTakers from "./components/TopTakers";
import Statistics from "./components/Statistics";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

defaults.font.family = "'EB Garamond', serif";
defaults.font.size = 16;

const ViewTestPage = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [viewQuestionsAndAnswers, setViewQuestionsAndAnswers] =
        useState(false);
    const [viewProvideAnswers, setViewProvideAnswers] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { test, submissions, questionsResult } = useAppSelector(
        (state) => state.viewTest
    );
    const { setTest, setSubmissions, setScores, setRates, setQuestionsResult } =
        viewTestActions;
    const dispatch = useDispatch();
    const submissionsTableRef = useRef<HTMLDivElement>(null);

    const { isLoading: isLoadingTest } = useQuery<TestItf>({
        queryKey: ["test", testId],
        queryFn: async () => {
            const responseData = await getTest(testId!);
            return responseData;
        },
        onSuccess: (data: any) => {
            dispatch(setTest(data));
        },
        onError: (err: any) => {
            if (err instanceof AxiosError) {
                setError(err.response?.data.message);
            }
        },
        retry: false,
    });

    const { isLoading: isLoadingSubmissions, refetch: refetchSubmissions } =
        useQuery<TestResult>({
            queryKey: [QUERY_KEYS.GET_TEST_SUBMISSIONS, testId],
            queryFn: async () => {
                const responseData = await getSubmissions(testId!);
                return responseData;
            },
            onSuccess: (data) => {
                dispatch(setSubmissions(data.submissions));
                dispatch(setScores(data));
                dispatch(setRates(data));
            },
            retry: false,
            enabled: !!test,
        });

    const { isLoading: isLoadingQuestionsResult } = useQuery<QuestionResult[]>({
        queryKey: [QUERY_KEYS.GET_QUESTIONS_RESULT_FOR_TEST, testId],
        queryFn: async () => {
            const responseData = await getQuestionsResultForTest(testId!);
            return responseData.questions_result;
        },
        onSuccess: (data) => {
            dispatch(setQuestionsResult(data));
        },
        retry: false,
        enabled: !!test,
    });

    const topSubmissions = useMemo(() => {
        if (!submissions) return [];
        return [...submissions]
            .sort((a, b) => (a.score && b.score ? b.score - a.score : 1))
            .slice(0, 5);
    }, [submissions]);

    return (
        <div className="xl:w-2/3 mx-auto py-4 md:py-10 px-4 md:px-8 shadow-lg">
            <Loading
                isLoading={isLoadingTest}
                loadingText={{ text: "Loading test's information..." }}
            />
            {error && !isLoadingTest && (
                <MessageAction
                    message={{
                        text: error,
                    }}
                    actions={{
                        primary: {
                            text: "Back to home",
                            onClick: () => navigate("/"),
                        },
                    }}
                />
            )}
            {test && (
                <>
                    <div className="flex flex-col md:flex-row gap-2">
                        <TestInfo />
                        <Statistics />
                        {topSubmissions.length > 0 && (
                            <TopTakers
                                submissions={topSubmissions}
                                onViewMore={() => {
                                    submissionsTableRef.current?.scrollIntoView(
                                        {
                                            behavior: "smooth",
                                        }
                                    );
                                }}
                            />
                        )}
                    </div>
                    <div className="flex justify-end mt-2">
                        <button
                            className="text-orange-600 underline hover:italic"
                            onClick={() => setViewQuestionsAndAnswers(true)}
                        >
                            <span>View questions and answers</span>
                        </button>
                        <Link
                            to={`/tests/${testId}/edit`}
                            className="ml-2 text-orange-600 underline hover:italic"
                        >
                            Update test
                        </Link>
                    </div>

                    <div className=" mt-4">
                        <Loading
                            isLoading={isLoadingSubmissions}
                            loadingText={{ text: "Loading submissions..." }}
                        />
                        {submissions.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-center text-2xl">
                                    Test result analysis
                                </h3>
                                <ScoreRangeBarChart submissions={submissions} />
                                <Loading
                                    isLoading={isLoadingQuestionsResult}
                                    loadingText={{
                                        text: "Loading questions result...",
                                    }}
                                />
                                {questionsResult.length > 0 && (
                                    <QuestionsResultChart
                                        questionsResult={questionsResult}
                                    />
                                )}
                            </div>
                        )}

                        {submissions.length > 0 && (
                            <div className="mt-4" ref={submissionsTableRef}>
                                <p className="text-2xl text-center">{`Submissions (${submissions?.length}/${test?.taker_ids.length})`}</p>
                                <div className="space-y-1 mt-2">
                                    {submissions.length > 0 && (
                                        <SubmissionsTable
                                            submissions={submissions}
                                            refetch={refetchSubmissions}
                                        />
                                    )}
                                    {submissions.length === 0 && (
                                        <p className="text-center">
                                            No submission found.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {viewQuestionsAndAnswers && (
                        <Modal
                            onClose={() => setViewQuestionsAndAnswers(false)}
                            width="w-3/4 md:w-3/5"
                        >
                            <ModalHeader title="Questions and Answers" />
                            <ModalBody>
                                {test.are_answers_provided === false && (
                                    <div className="bg-orange-200 px-8 py-2">
                                        Please provide answers for all questions{" "}
                                        <button
                                            className="underline hover:font-bold"
                                            onClick={() => {
                                                setViewQuestionsAndAnswers(
                                                    false
                                                );
                                                setViewProvideAnswers(true);
                                            }}
                                        >
                                            here
                                        </button>
                                    </div>
                                )}
                                {test.are_answers_provided === true && (
                                    <div className="flex justify-end">
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setViewQuestionsAndAnswers(
                                                    false
                                                );
                                                setViewProvideAnswers(true);
                                            }}
                                        >
                                            Update answers
                                        </Button>
                                    </div>
                                )}
                                <div className="mt-4">
                                    <TestQuestionsAndAnswers
                                        test={test}
                                        userAnswers={[]}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter></ModalFooter>
                        </Modal>
                    )}

                    {viewProvideAnswers && (
                        <Modal
                            onClose={() => setViewProvideAnswers(false)}
                            width="w-3/4 md:w-3/5"
                        >
                            <ModalHeader title="Provide Answers" />
                            <ModalBody>
                                {/* PLEASE UPDATE THE LOGIC WHEN UPDATE ANSWERS - ENTER CREATE TEST SLICE */}
                                <TestAnswers />
                            </ModalBody>
                            <ModalFooter></ModalFooter>
                        </Modal>
                    )}
                </>
            )}
        </div>
    );
};

export default ViewTestPage;
