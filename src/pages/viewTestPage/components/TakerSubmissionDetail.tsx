import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import {
    AnswerBodyContentItf,
    SubmissionItf,
    TestItf,
    UserAnswerItf,
    userItf,
} from "../../../types/types";
import {
    getSubmissionAnswers,
    getTestWithTakerAnswers,
} from "../../../services/test";
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
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import { takeTestActions } from "../../../stores/takeTest";
import { useDispatch } from "react-redux";
import { QUERY_KEYS } from "../../../config/constants/queryMutationKeys";
import { viewTestActions } from "../../../stores/viewTest";

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
            <span className="leading-tight text-sm">{label}:</span>
            <span className="font-bold bg-orange-500 text-white w-fit px-2 rounded-full text-sm">
                {text}
            </span>
        </div>
    );
};

const TakerSubmissionDetail = () => {
    const { test, currentSubmissionBeingViewed: submission } = useSelector(
        (state: RootState) => state.viewTest
    );
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [isSticky, setIsSticky] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
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

    const { isLoading: isLoadingSubmissions, data: submissionAnswers } =
        useQuery({
            queryFn: async () => {
                const responseData = await getSubmissionAnswers(
                    test!.id!,
                    submission!.id
                );
                return responseData.answers;
            },
            onSuccess: (data) => {
                dispatch(
                    viewTestActions.updateCurrentSubmission({
                        answers: data,
                    })
                );
            },
            queryKey: [
                QUERY_KEYS.GET_SUBMISSION_ANSWERS,
                { submission_id: submission!.id },
            ],
        });
    return (
        <Modal
            onClose={() =>
                dispatch(viewTestActions.setCurrentSubmissionBeingViewed(null))
            }
            className="w-5/6 md:w-2/3 lg:w-1/2"
        >
            <ModalHeader title={`Taker's submissions detail`} />
            <ModalBody>
                <div className="relative">
                    {submission && (
                        <div
                            className={`grid grid-cols-8 gap-1 bg-orange-100 border border-dashed border-orange-600 relative p-1 ${
                                isSticky ? "sticky shadow-lg -top-4 z-20" : ""
                            }`}
                        >
                            <div
                                className={`${
                                    isSticky
                                        ? "hidden"
                                        : "row-span-4 col-span-2"
                                } overflow-hidden self-start rounded-full shadow-md m-3 flex justify-center items-center w-20 h-20 mx-auto`}
                            >
                                <img
                                    src={
                                        (submission.taker_id as userItf)?.photo
                                    }
                                    alt=""
                                    className="rounded-full w-full h-full object-cover"
                                />
                            </div>
                            <TakerInfoItem
                                label="Taker's name"
                                text={(submission.taker_id as userItf)?.name}
                                className={
                                    isSticky ? "col-span-4" : "col-span-3"
                                }
                            />
                            <TakerInfoItem
                                label="Taker's email"
                                text={(submission.taker_id as userItf)?.email}
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
                                className={isSticky ? "hidden" : "col-span-3"}
                            />
                            <TakerInfoItem
                                label="Wrong answers"
                                text={submission.wrong_answers || 0}
                                className={isSticky ? "hidden" : "col-span-3"}
                            />
                            <TakerInfoItem
                                label="Score"
                                text={submission.score || 0}
                                className={
                                    isSticky ? "col-span-4" : "col-span-3"
                                }
                            />
                        </div>
                    )}
                    <div className="sentinel" ref={sentinelRef}></div>
                    {isLoadingSubmissions && (
                        <p className="text-center">Loading...</p>
                    )}
                    {submissionAnswers && (
                        <TestQuestionsAndAnswers
                            test={test!}
                            userAnswers={submissionAnswers}
                        />
                    )}
                </div>
            </ModalBody>
            <ModalFooter></ModalFooter>
        </Modal>
    );
};

export default TakerSubmissionDetail;
