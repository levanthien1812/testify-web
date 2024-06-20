import { TestItf, SubmissionItf } from "../../types/types";
import { useQuery } from "react-query";
import { getSubmissions, getTest } from "../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import TestInfo from "../takeTestPage/components/TestInfo";
import SubmissionsTable from "./components/SubmissionsTable";
import { useState } from "react";
import Modal from "../../components/modals/Modal";
import TestQuestionsAndAnswers from "../takeTestPage/components/TestQuestionsAndAnswers";

const ViewTestPage = () => {
    const { testId } = useParams();
    const [viewQuestionsAndAnswers, setViewQuestionsAndAnswers] =
        useState(false);

    const { isLoading: isLoadingTest, data: test } = useQuery<TestItf>({
        queryKey: ["test", testId],
        queryFn: async () => {
            const responseData = await getTest(testId!);
            return responseData.test;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        },
        retry: false,
    });

    const { isLoading: isLoadingSubmissions, data: submissions } = useQuery<
        SubmissionItf[]
    >({
        queryKey: ["test-submissions", testId],
        queryFn: async () => {
            const responseData = await getSubmissions(testId!);
            return responseData.submissions;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        },
    });

    return (
        <div className="xl:w-2/3 md:w-5/6 mx-auto py-10 shadow-lg px-8">
            {test && <TestInfo test={test} />}
            {isLoadingTest && <p className="text-center">Loading test ...</p>}
            <div className="flex justify-end mt-2">
                <button
                    className="text-orange-600 underline hover:italic"
                    onClick={() => setViewQuestionsAndAnswers(true)}
                >
                    <span>View questions and answers</span>
                </button>
            </div>

            <div className=" mt-4">
                <p className="text-2xl text-center">Submissions</p>
                {isLoadingSubmissions && (
                    <p className="text-center">Loading submission ...</p>
                )}
                {submissions && (
                    <div className="space-y-1 mt-2">
                        {submissions.length > 0 && (
                            <SubmissionsTable submissions={submissions} />
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
                    className="w-5/6 md:w-2/3"
                >
                    <Modal.Header
                        title="Questions and Answers"
                        onClose={() => setViewQuestionsAndAnswers(false)}
                    />
                    <Modal.Body>
                        <TestQuestionsAndAnswers test={test} />
                    </Modal.Body>
                    <Modal.Footer>
                        <button>Cancel</button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default ViewTestPage;
