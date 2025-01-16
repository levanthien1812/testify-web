import { format } from "date-fns";
import React from "react";
import { formatTime } from "../../../utils/time";
import { TestItf, SubmissionItf } from "../../../types/types";
import Answer from "./Answer";
import TestQuetionsAndAnswers from "./TestQuestionsAndAnswers";
import Button from "../../../components/elements/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";

type SubmissionProps = {
    submission: SubmissionItf;
};

const Submission = ({ submission }: SubmissionProps) => {
    const [viewDetail, setViewDetail] = React.useState(false);
    const { test, answers } = useSelector((state: RootState) => state.takeTest);

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

            {submission.score && <p>Score: {submission.score}</p>}
            {submission.correct_answers && (
                <p>Correct answers: {submission.correct_answers}</p>
            )}
            {submission.wrong_answers && (
                <p>Wrong answers: {submission.wrong_answers}</p>
            )}
            <Button onClick={handleViewDetail}>
                {!viewDetail ? "View detail" : "Hide detail"}
            </Button>

            {viewDetail && (
                <TestQuetionsAndAnswers test={test!} answers={answers} />
            )}
        </div>
    );
};

export default Submission;
