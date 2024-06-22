import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { SubmissionItf, TestItf, userItf } from "../../../types/types";
import { getTest, getTestWithTakerAnswers } from "../../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../components/modals/Modal";
import TestQuestionsAndAnswers from "../../takeTestPage/components/TestQuestionsAndAnswers";
import { useParams } from "react-router";
import { format } from "date-fns";

type TakerSubmissionDetailProps = {
    submission: SubmissionItf;
    takerId: string;
    onClose: () => void;
};

const TakerSubmissionDetail = ({
    submission,
    takerId,
    onClose,
}: TakerSubmissionDetailProps) => {
    const { testId } = useParams();
    useMemo(() => {
        if (submission) {
            console.log(submission);
        }
    }, [testId]);

    const { isLoading: isLoadingTest, data: testWithAnswers } =
        useQuery<TestItf>({
            queryKey: ["test", { test_id: testId, taker_id: takerId }],
            queryFn: async () => {
                const responseData = await getTestWithTakerAnswers(
                    testId!,
                    takerId!
                );
                return responseData.test;
            },
            onError: (error) => {
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data.message);
                }
            },
            retry: false,
        });
    return (
        <Modal onClose={onClose} className="w-5/6 md:w-2/3">
            <ModalHeader title={`Taker's submissions detail`} />
            <ModalBody>
                {submission && (
                    <div className="grid grid-cols-3 gap-2 bg-orange-100 p-4 border border-orange-600">
                        <p>
                            Taker's name:{" "}
                            {
                                (submission.taker_id as Omit<userItf, "role">)
                                    .name
                            }
                        </p>
                        <p className="col-span-2">
                            Taker's email:
                            {
                                (submission.taker_id as Omit<userItf, "role">)
                                    .email
                            }
                        </p>
                        <p>
                            {" "}
                            Start time:{" "}
                            {format(
                                new Date(submission.start_time),
                                "dd/MM/yyyy HH:mm:ss"
                            )}
                        </p>
                        <p className="col-span-2">
                            {" "}
                            Submit time:{" "}
                            {format(
                                new Date(submission.submit_time),
                                "dd/MM/yyyy HH:mm:ss"
                            )}
                        </p>
                        <p>Correct answers: {submission.correct_answers}</p>
                        <p>Wrong answers: {submission.wrong_answers}</p>
                        <p className="font-bold"> Score: {submission.score}</p>
                    </div>
                )}
                {isLoadingTest && <p className="text-center">Loading...</p>}
                {testWithAnswers && (
                    <TestQuestionsAndAnswers test={testWithAnswers} />
                )}
            </ModalBody>
            <ModalFooter></ModalFooter>
        </Modal>
    );
};

export default TakerSubmissionDetail;
