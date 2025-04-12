import { format } from "date-fns";
import React from "react";
import { formatTime } from "../../../utils/time";
import { SubmissionItf } from "../../../types/types";
import TestQuetionsAndAnswers from "./TestQuestionsAndAnswers";
import Button from "../../../components/elements/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import { useQuery } from "react-query";
import { QUERY_KEYS } from "../../../config/constants/queryMutationKeys";
import { getSubmissionAnswers } from "../../../services/test";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../../stores/takeTest";

type SubmissionProps = {
    submission: SubmissionItf;
};

const Submission = ({ submission }: SubmissionProps) => {
    const [viewDetail, setViewDetail] = React.useState(false);
    const { test, answers } = useSelector((state: RootState) => state.takeTest);
    const dispatch = useDispatch();

    useQuery({
        queryFn: async () => {
            const responseData = await getSubmissionAnswers(
                test!.id!,
                submission.id!
            );
            dispatch(takeTestActions.setAnswers(responseData.answers));
        },
        queryKey: QUERY_KEYS.GET_SUBMISSION_ANSWERS,
    });

    const handleViewDetail = () => {
        setViewDetail((prev) => !prev);
    };

    return (
        <div className="border-t px-8 py-4">
            <p className="text-lg">Your submission</p>

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
            <Button onClick={handleViewDetail}>
                {!viewDetail ? "View detail" : "Hide detail"}
            </Button>

            {viewDetail && (
                <TestQuetionsAndAnswers test={test!} userAnswers={answers} />
            )}
        </div>
    );
};

export default Submission;
