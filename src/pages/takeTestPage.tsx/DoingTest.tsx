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
import { createAnswers } from "../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

type DoingTestProps = {
    test: TestItf;
    remainingTime: number;
};

const DoingTest = ({ test, remainingTime }: DoingTestProps) => {
    const [answers, setAnswers] = useState<UserAnswer[]>([]);
    const [submittable, setSubmittable] = useState(false);

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

    const { mutate } = useMutation({
        mutationFn: async () => {
            const responseData = await createAnswers(test._id, answers);
            return responseData.answers;
        },
        onSuccess: (data) => {
            console.log(data);
            toast.success("Answers submitted successfully");
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
    }, [remainingTime])

    const handleSubmit = () => {
        mutate();
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
        <div className="space-y-1">
            {test.parts &&
                test.parts.map((part) => {
                    return (
                        <div key={part._id} className="">
                            <div className="text-lg bg-gray-200 px-4 py-1">
                                <span className="underline">
                                    Part {part.order}:
                                </span>{" "}
                                <span className="uppercase"> {part.name}</span>
                            </div>

                            <div>
                                {part.questions &&
                                    part.questions.map((question) => (
                                        <div
                                            className="px-4 py-2"
                                            key={question._id}
                                        >
                                            <div>
                                                Question {question.order}:{" "}
                                            </div>
                                            {question.type ===
                                                questionTypes.MULITPLE_CHOICES && (
                                                <MultipleChoicesQuestion
                                                    content={
                                                        question.content as MultipleChoiceQuestionItf
                                                    }
                                                    onProvideAnswer={(answer) =>
                                                        handleProvideAnswer({
                                                            question_id:
                                                                question._id,
                                                            answer: answer,
                                                        })
                                                    }
                                                />
                                            )}
                                            {question.type ===
                                                questionTypes.FILL_GAPS && (
                                                <FillGapsQuestion
                                                    content={
                                                        question.content as FillGapsQuestionItf
                                                    }
                                                    onProvideAnswer={(answer) =>
                                                        handleProvideAnswer({
                                                            question_id:
                                                                question._id,
                                                            answer: answer,
                                                        })
                                                    }
                                                />
                                            )}
                                            {question.type ===
                                                questionTypes.MATCHING && (
                                                <MatchingQuestion
                                                    content={
                                                        question.content as MatchingQuestionItf
                                                    }
                                                    onProvideAnswer={(answer) =>
                                                        handleProvideAnswer({
                                                            question_id:
                                                                question._id,
                                                            answer: answer,
                                                        })
                                                    }
                                                />
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    );
                })}

            <div className="flex justify-center">
                <button
                    className="bg-orange-600 text-white px-20 py-1.5 hover:bg-orange-700 uppercase disabled:bg-gray-600 disabled:cursor-not-allowed"
                    onClick={handleSubmit}
                    disabled={!submittable}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default DoingTest;
