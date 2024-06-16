import { format } from "date-fns";
import React from "react";
import { formatTime } from "../../../utils/time";
import { TestItf, TestResultItf } from "../../../types/types";
import Answer from "./Answer";

type SubmissionProps = {
    test: TestItf;
    submission: TestResultItf;
    onViewDetail: () => void;
};

const Submission = ({ submission, test, onViewDetail }: SubmissionProps) => {
    const [viewDetail, setViewDetail] = React.useState(false);

    const handleViewDetail = () => {
        setViewDetail(true);
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

            <p>Score: {submission.score}</p>
            <p>Correct answers: {submission.correct_answers}</p>
            <p>Wrong answers: {submission.wrong_answers}</p>
            <button
                className="bg-orange-600 text-white px-8 py-0.5 mt-0.5"
                onClick={handleViewDetail}
            >
                {!viewDetail ? "View detail" : "Hide detail"}
            </button>

            {viewDetail && (
                <div className="mt-4">
                    {test.num_parts > 1 &&
                        test.parts.map((part) => {
                            return (
                                <div key={part._id} className="">
                                    <div className="text-lg bg-gray-200 px-4 py-1">
                                        <span className="underline">
                                            Part {part.order}:
                                        </span>{" "}
                                        <span className="uppercase">
                                            {" "}
                                            {part.name}
                                        </span>
                                    </div>

                                    <div>
                                        {part.questions &&
                                            part.questions.map((question) => (
                                                <Answer
                                                    question={question}
                                                    key={question._id}
                                                />
                                            ))}
                                    </div>
                                </div>
                            );
                        })}
                    {test.num_parts <= 1 &&
                        test.questions!.map((question) => (
                            <Answer question={question} key={question._id} />
                        ))}
                </div>
            )}
        </div>
    );
};

export default Submission;
