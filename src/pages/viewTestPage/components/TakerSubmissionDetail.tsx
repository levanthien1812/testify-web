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

const TakerInfoItem = ({
    label,
    text,
}: {
    label: string;
    text: string | number;
}) => {
    return (
        <div className="col-span-3 border border-dashed flex flex-col border-gray-400 px-2 py-1">
            <span className="leading-tight">{label}:</span>
            <span className="font-bold bg-orange-500 text-white w-fit px-2 rounded-full">
                {text}
            </span>
        </div>
    );
};

const TakerSubmissionDetail = ({
    submission,
    takerId,
    onClose,
}: TakerSubmissionDetailProps) => {
    const { testId } = useParams();

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
        <Modal onClose={onClose} className="w-5/6 md:w-2/3 lg:w-1/2">
            <ModalHeader title={`Taker's submissions detail`} />
            <ModalBody>
                {submission && (
                    <div className="grid grid-cols-8 gap-1 bg-orange-100 px-4 py-2 border border-dashed border-orange-600">
                        <div className="row-span-4 col-span-2 overflow-hidden m-2">
                            <img
                                src={(submission.taker_id as userItf).photo}
                                alt=""
                                className="rounded-full shadow-md"
                            />
                        </div>
                        <TakerInfoItem
                            label="Taker's name"
                            text={(submission.taker_id as userItf).name}
                        />
                        <TakerInfoItem
                            label="Taker's email"
                            text={(submission.taker_id as userItf).email}
                        />
                        <TakerInfoItem
                            label="Start time"
                            text={format(
                                new Date(submission.start_time),
                                "dd/MM/yyyy HH:mm:ss"
                            )}
                        />
                        <TakerInfoItem
                            label="Submit time"
                            text={format(
                                new Date(submission.submit_time),
                                "dd/MM/yyyy HH:mm:ss"
                            )}
                        />
                        <TakerInfoItem
                            label="Correct answers"
                            text={submission.correct_answers || 0}
                        />
                        <TakerInfoItem
                            label="Wrong answers"
                            text={submission.wrong_answers || 0}
                        />
                        <TakerInfoItem
                            label="Score"
                            text={submission.score || 0}
                        />
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
