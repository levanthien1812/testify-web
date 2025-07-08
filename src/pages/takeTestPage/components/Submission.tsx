import { format } from "date-fns";
import React from "react";
import { formatTime } from "../../../utils/time";
import { SubmissionItf } from "../../../types/types";
import TestQuetionsAndAnswers from "./TestQuestionsAndAnswers";
import Button from "../../../components/elements/Button";
import { useQuery } from "react-query";
import { QUERY_KEYS } from "../../../config/constants/queryMutationKeys";
import { getSubmissionAnswers } from "../../../services/test";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../../stores/takeTest";
import { useAppSelector } from "../../../hooks/hooks";

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
        <div className="border-t py-2">
            <p>
                Submit time:{" "}
                {format(new Date(submission.submit_time), "dd/MM/yyyy HH:mm")}
            </p>

            <p>
                Duration:{" "}
                {formatTime(
                    (new Date(submission.submit_time).getTime() -
                        new Date(submission.start_time).getTime()) /
                        1000
                )}{" "}
            </p>

            {submission.is_evaluated && (
                <>
                    <p>Score: {submission.score}</p>
                    <p>Correct answers: {submission.correct_answers}</p>
                    <p>Wrong answers: {submission.wrong_answers}</p>
                </>
            )}
            <Button onClick={handleViewDetail} className="mt-2" link>
                {!viewDetail ? "View detail" : "Hide detail"}
            </Button>

            {viewDetail && (
                <TestQuetionsAndAnswers
                    test={test!}
                    userAnswers={submission.answers}
                />
            )}
        </div>
    );
};

export default Submission;
