import { format } from "date-fns";
import React from "react";
import { formatTime } from "../../../utils/time";
import { TestItf, SubmissionItf } from "../../../types/types";
import Answer from "./Answer";
import SubmissionDetail from "./TestQuestionsAndAnswers";

type SubmissionProps = {
    test: TestItf;
    submission: SubmissionItf;
    onViewDetail: () => void;
};

const Submission = ({ submission, test, onViewDetail }: SubmissionProps) => {
    const [viewDetail, setViewDetail] = React.useState(false);

    const handleViewDetail = () => {
        setViewDetail((prev) => !prev);
        onViewDetail();
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
            <button
                className="bg-orange-600 text-white px-8 py-0.5 mt-0.5"
                onClick={handleViewDetail}
            >
                {!viewDetail ? "View detail" : "Hide detail"}
            </button>

            {viewDetail && <SubmissionDetail test={test} />}
        </div>
    );
};

export default Submission;
