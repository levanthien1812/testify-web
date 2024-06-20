import React, { useEffect, useState } from "react";
import {
    FillGapsQuestionItf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
    TestItf,
    UserAnswer,
} from "../../types/types";
import { questionTypes } from "../../config/config";
import MultipleChoicesQuestion from "./components/MultipleChoicesQuestion";
import FillGapsQuestion from "./components/FillGapsQuestion";
import MatchingQuestion from "./components/MatchingQuestion";
import { useMutation } from "react-query";
import { submitAnswers } from "../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import RemainingTime from "./components/RemainingTime";
import Swal from "sweetalert2";
import Question from "./components/Question";

type DoingTestProps = {
    test: TestItf;
    remainingTime: number;
    startTime: Date;
    onAfterSubmit: () => void;
};

const DoingTest = ({
    test,
    remainingTime,
    startTime,
    onAfterSubmit,
}: DoingTestProps) => {
    const [answers, setAnswers] = useState<UserAnswer[]>([]);
    const [submittable, setSubmittable] = useState(false);
    const [confirmSubmit, setConfirmSubmit] = useState(false);

    const handleProvideAnswer = (userAnswer: UserAnswer) => {
        const updatedAnswers = [...answers];
        const index = updatedAnswers.findIndex(
            (answer) => answer.question_id === userAnswer.question_id
        );
        if (index === -1) {
            updatedAnswers.push(userAnswer);
        } else {
            updatedAnswers[index] = userAnswer;
        }
        setAnswers(updatedAnswers);
    };

    const { mutate, isLoading } = useMutation({
        mutationFn: async () => {
            const responseData = await submitAnswers(
                test._id,
                answers,
                startTime
            );
            return responseData.answers;
        },
        onSuccess: (data) => {
            console.log(data);
            toast.success("Answers submitted successfully");
            onAfterSubmit();
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        },
    });

    useEffect(() => {
        if (remainingTime <= 0) {
            mutate();
        }
    }, [remainingTime]);

    const handleSubmit = () => {
        Swal.fire({
            title: "Submission Confirmation",
            text: "Do you really want to submit your answers?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                mutate();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                return;
            }
        });
    };

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (test.num_questions === answers.length) {
            setSubmittable(true);
        } else {
            setSubmittable(false);
        }
    }, [answers]);

    return (
        <div>
            <RemainingTime
                remainingTime={remainingTime}
                totalTime={test.duration * 60 * 1000}
            />
            <div className="py-8 px-8">
                <div className="space-y-1">
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
                                                <Question
                                                    question={question}
                                                    key={question._id}
                                                    onProvideAnswer={
                                                        handleProvideAnswer
                                                    }
                                                />
                                            ))}
                                    </div>
                                </div>
                            );
                        })}
                    {test.num_parts <= 1 &&
                        test.questions!.map((question) => (
                            <Question
                                question={question}
                                key={question._id}
                                onProvideAnswer={handleProvideAnswer}
                            />
                        ))}

                    <div className="flex justify-center">
                        <button
                            className="bg-orange-600 text-white px-20 py-1.5 hover:bg-orange-700 uppercase disabled:bg-gray-600 disabled:cursor-not-allowed"
                            onClick={handleSubmit}
                            disabled={!submittable || isLoading}
                        >
                            {isLoading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoingTest;