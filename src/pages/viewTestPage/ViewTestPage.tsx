import { TestItf, SubmissionItf } from "../../types/types";
import { useQuery } from "react-query";
import { getSubmissions, getTest } from "../../services/test";
import { useParams } from "react-router";
import SubmissionsTable from "./components/SubmissionsTable";
import { useState } from "react";
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

const ViewTestPage = () => {
    const { testId } = useParams();
    const [viewQuestionsAndAnswers, setViewQuestionsAndAnswers] =
        useState(false);
    const [viewProvideAnswers, setViewProvideAnswers] = useState(false);
    const { test, submissions } = useAppSelector((state) => state.viewTest);
    const { setTest, setSubmissions } = viewTestActions;
    const dispatch = useDispatch();

    const { isLoading: isLoadingTest, refetch: refetchTest } =
        useQuery<TestItf>({
            queryKey: ["test", testId],
            queryFn: async () => {
                const responseData = await getTest(testId!);
                return responseData;
            },
            onSuccess: (data: any) => {
                dispatch(setTest(data));
            },
            retry: false,
        });

    const { isLoading: isLoadingSubmissions, refetch: refetchSubmissions } =
        useQuery<SubmissionItf[]>({
            queryKey: [QUERY_KEYS.GET_TEST_SUBMISSIONS, testId],
            queryFn: async () => {
                const responseData = await getSubmissions(testId!);
                return responseData.submissions;
            },
            onSuccess: (data) => {
                dispatch(setSubmissions(data));
            },
            retry: false,
        });

    return (
        <div className="xl:w-2/3 md:w-5/6 mx-auto py-10 shadow-lg px-8">
            {test && <TestInfo />}
            {isLoadingTest && <p className="text-center">Loading test ...</p>}
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
                <p className="text-2xl text-center">{`Submissions (${submissions?.length}/${test?.taker_ids.length})`}</p>
                {isLoadingSubmissions && (
                    <p className="text-center">Loading submission ...</p>
                )}
                {submissions && (
                    <div className="space-y-1 mt-2">
                        {submissions.length > 0 && (
                            <SubmissionsTable
                                submissions={submissions}
                                refetch={refetchSubmissions}
                            />
                        )}
                        {submissions.length === 0 && (
                            <p className="text-center">No submission found.</p>
                        )}
                    </div>
                )}
            </div>

            {viewQuestionsAndAnswers && test && (
                <Modal
                    onClose={() => setViewQuestionsAndAnswers(false)}
                    className="w-3/4 md:w-3/5"
                >
                    <ModalHeader title="Questions and Answers" />
                    <ModalBody>
                        {test.are_answers_provided === false && (
                            <div className="bg-orange-200 px-8 py-2">
                                Please provide answers for all questions{" "}
                                <button
                                    className="underline hover:font-bold"
                                    onClick={() => {
                                        setViewQuestionsAndAnswers(false);
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
                                        setViewQuestionsAndAnswers(false);
                                        setViewProvideAnswers(true);
                                    }}
                                >
                                    Update answers
                                </Button>
                            </div>
                        )}
                        <TestQuestionsAndAnswers test={test} userAnswers={[]} />
                    </ModalBody>
                    <ModalFooter></ModalFooter>
                </Modal>
            )}

            {viewProvideAnswers && test && (
                <Modal
                    onClose={() => setViewProvideAnswers(false)}
                    className="w-3/4 md:w-3/5"
                >
                    <ModalHeader title="Provide Answers" />
                    <ModalBody>
                        {/* PLEASE UPDATE THE LOGIC WHEN UPDATE ANSWERS - ENTER CREATE TEST SLICE */}
                        <TestAnswers />
                    </ModalBody>
                    <ModalFooter></ModalFooter>
                </Modal>
            )}
        </div>
    );
};

export default ViewTestPage;
