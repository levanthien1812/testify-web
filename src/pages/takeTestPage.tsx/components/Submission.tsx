import { format } from "date-fns";
import React from "react";
import { formatTime } from "../../../utils/time";
import { TestResultItf } from "../../../types/types";

type SubmissionProps = {
    submission: TestResultItf;
};

const Submission = ({ submission }: SubmissionProps) => {
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

            <p>Score: {submission.score}</p>
            <p>Correct answers: {submission.correct_answers}</p>
            <p>Wrong answers: {submission.wrong_answers}</p>
        </div>
    );
};

export default Submission;
