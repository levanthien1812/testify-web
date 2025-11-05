import { format } from "date-fns";
import React from "react";
import { formatTime } from "../../../utils/time";
import { SubmissionItf } from "../../../types/types";
import TestQuestionsAndAnswers from "./TestQuestionsAndAnswers";
import Button from "../../../components/elements/Button";
import { useQuery } from "react-query";
import { QUERY_KEYS } from "../../../config/constants/queryMutationKeys";
import { getSubmissionAnswers } from "../../../services/test";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../../stores/takeTest";
import { useAppSelector } from "../../../hooks/hooks";
import { getRound } from "../../../utils/primitives";

type SubmissionProps = {
    submission: SubmissionItf;
};

const Submission = ({ submission }: SubmissionProps) => {
    const [viewDetail, setViewDetail] = React.useState(false);
    const { test } = useAppSelector((state) => state.takeTest);
    const dispatch = useDispatch();

    useQuery({
        queryFn: async () => {
            if (!test) return;
            const responseData = await getSubmissionAnswers(
                test.id,
                submission.id
            );
            dispatch(
                takeTestActions.setSubmissionAnswers({
                    submissionId: submission.id!,
                    answers: responseData.answers,
                })
            );
        },
        queryKey: [
            QUERY_KEYS.GET_SUBMISSION_ANSWERS,
            { submission_id: submission.id },
        ],
        enabled: !submission.answers || submission.answers.length === 0,
    });

    const handleViewDetail = () => {
        setViewDetail((prev) => !prev);
    };

    return (
        <div
            className={`border ${
                !submission.is_evaluated
                    ? "border-green-500"
                    : "border-gray-300"
            } flex`}
        >
            <div
                className={`flex ${
                    viewDetail ? "flex-col w-[200px]" : "flex-row w-full"
                }`}
            >
                <div className={`${viewDetail ? "" : "grow"} p-2 bg-white`}>
                    <p>
                        Submit time:{" "}
                        <span className="font-bold">
                            {format(
                                new Date(submission.submit_time),
                                "dd/MM/yyyy HH:mm"
                            )}
                        </span>
                    </p>

                    <p>
                        Duration:{" "}
                        <span className="font-bold">
                            {formatTime(
                                (new Date(submission.submit_time).getTime() -
                                    new Date(submission.start_time).getTime()) /
                                    1000
                            )}
                        </span>
                    </p>

                    {submission.is_evaluated && (
                        <>
                            <div className="">
                                Score:{" "}
                                <span className="bg-orange-600 text-white px-4 rounded-full">
                                    {getRound(submission.score || 0)}
                                </span>
                            </div>
                            <div className="">
                                Correct answers:{" "}
                                <span className="bg-orange-600 text-white px-4 rounded-full">
                                    {submission.correct_answers}
                                </span>
                            </div>
                            <div className="">
                                Wrong answers:{" "}
                                <span className="bg-orange-600 text-white px-4 rounded-full">
                                    {submission.wrong_answers}
                                </span>
                            </div>
                        </>
                    )}
                    <Button onClick={handleViewDetail} className="mt-2" link>
                        {!viewDetail ? "View detail" : "Hide detail"}
                    </Button>
                </div>
                <div
                    className={`flex flex-col justify-center items-center ${
                        viewDetail ? "w-full" : "w-[100px]"
                    } bg-green-500 text-white`}
                >
                    <div>Score</div>
                    <div className="text-2xl font-bold">
                        {getRound(submission.score || 0)}
                    </div>
                </div>
            </div>

            {viewDetail && (
                <div className="border-l border-gray-300 grow">
                    <TestQuestionsAndAnswers
                        test={test!}
                        userAnswers={submission.answers}
                    />
                </div>
            )}
        </div>
    );
};

export default Submission;
