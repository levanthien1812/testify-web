import React, { useEffect, useMemo, useRef, useState } from "react";
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
    className,
}: {
    label: string;
    text: string | number;
    className?: string;
}) => {
    return (
        <div
            className={`border border-dashed flex flex-col border-gray-400 px-2 py-1 transition-all ease-in-out duration-300 self-center ${className} `}
        >
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
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                console.log(entry.isIntersecting);
                setIsSticky(!entry.isIntersecting);
            },
            {
                threshold: [0],
            }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }
        return () => {
            if (sentinelRef.current) {
                observer.unobserve(sentinelRef.current);
            }
        };
    }, []);

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
                <div className="relative">
                    {submission && (
                        <div
                            className={`grid grid-cols-8 gap-1 bg-orange-100 border border-dashed border-orange-600 relative ${
                                isSticky
                                    ? "sticky shadow-lg -top-4 z-20 py-1 px-2"
                                    : " px-4 py-2"
                            }`}
                        >
                            <div
                                className={`${
                                    !isSticky && "row-span-4 col-span-2"
                                } overflow-hidden self-start rounded-full shadow-md m-3`}
                            >
                                <img
                                    src={(submission.taker_id as userItf).photo}
                                    alt=""
                                    className=""
                                />
                            </div>
                            <TakerInfoItem
                                label="Taker's name"
                                text={(submission.taker_id as userItf).name}
                                className={
                                    isSticky ? "col-span-2" : "col-span-3"
                                }
                            />
                            <TakerInfoItem
                                label="Taker's email"
                                text={(submission.taker_id as userItf).email}
                                className={isSticky ? "hidden" : "col-span-3"}
                            />
                            <TakerInfoItem
                                label="Start time"
                                text={format(
                                    new Date(submission.start_time),
                                    "dd/MM/yyyy HH:mm:ss"
                                )}
                                className={isSticky ? "hidden" : "col-span-3"}
                            />
                            <TakerInfoItem
                                label="Submit time"
                                text={format(
                                    new Date(submission.submit_time),
                                    "dd/MM/yyyy HH:mm:ss"
                                )}
                                className={isSticky ? "hidden" : "col-span-3"}
                            />
                            <TakerInfoItem
                                label="Correct answers"
                                text={submission.correct_answers || 0}
                                className={
                                    isSticky ? "col-span-2" : "col-span-3"
                                }
                            />
                            <TakerInfoItem
                                label="Wrong answers"
                                text={submission.wrong_answers || 0}
                                className={
                                    isSticky ? "col-span-2" : "col-span-3"
                                }
                            />
                            <TakerInfoItem
                                label="Score"
                                text={submission.score || 0}
                                className={
                                    isSticky ? "col-span-1" : "col-span-3"
                                }
                            />
                        </div>
                    )}
                    <div className="sentinel" ref={sentinelRef}></div>
                    {isLoadingTest && <p className="text-center">Loading...</p>}
                    {testWithAnswers && (
                        <TestQuestionsAndAnswers test={testWithAnswers} />
                    )}
                </div>
            </ModalBody>
            <ModalFooter></ModalFooter>
        </Modal>
    );
};

export default TakerSubmissionDetail;
