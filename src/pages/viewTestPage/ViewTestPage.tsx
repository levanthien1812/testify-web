import React from "react";
import { TestItf, SubmissionItf, userItf } from "../../types/types";
import { useQuery } from "react-query";
import { getSubmissions, getTest } from "../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import TestInfo from "../takeTestPage/components/TestInfo";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { formatTime } from "../../utils/time";
import SubmissionsTable from "./SubmissionsTable";

const ViewTestPage = () => {
    const { testId } = useParams();

    const {
        isLoading: isLoadingTest,
        data: test,
        refetch: refetchTest,
    } = useQuery<TestItf>({
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

    const {
        isLoading: isLoadingSubmissions,
        data: submissions,
        refetch: refetchSubmissions,
    } = useQuery<SubmissionItf[]>({
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
            <button className="text-orange-600 underline hover:italic">
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="text-sm mr-1"
                />{" "}
                <span>View questions and answers</span>
            </button>
            {test && <TestInfo test={test} />}
            {submissions && (
                <div className=" mt-4">
                    <p className="text-2xl text-center">Submissions</p>
                    <div className="space-y-1 mt-2">
                        {submissions.length > 0 && (
                            <SubmissionsTable submissions={submissions} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewTestPage;
