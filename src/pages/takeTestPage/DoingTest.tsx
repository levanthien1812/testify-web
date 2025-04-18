import { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { submitAnswers } from "../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import RemainingTime from "./components/RemainingTime";
import Swal from "sweetalert2";
import Question from "./components/Question";
import Button from "../../components/elements/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/rootState";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../stores/takeTest";
import { TOAST_MESSAGES } from "../../config/constants/toasts";
import { MUTATION_KEYS } from "../../config/constants/queryMutationKeys";

type DoingTestProps = {
    onAfterSubmit: () => void;
};

const DoingTest = ({ onAfterSubmit }: DoingTestProps) => {
    const { answers, startTime, test, submittable } = useSelector(
        (state: RootState) => state.takeTest
    );
    const dispatch = useDispatch();
    const remainingIntervalRef = useRef<NodeJS.Timer | null>(null);
    const [remainingTime, setRemainingTime] = useState(
        test!.duration * 60 * 1000
    );

    const { mutate, isLoading } = useMutation({
        mutationFn: async () => {
            const responseData = await submitAnswers(
                test!.id,
                answers,
                startTime
            );
            return responseData.answers;
        },
        mutationKey: [
            MUTATION_KEYS.SUBMIT_ANSWERS,
            { test_id: test!.id, date: new Date() },
        ],
        onSuccess: (data) => {
            toast.success(TOAST_MESSAGES.TEST_SUBMITTED_SUCCESSFULLY);
            dispatch(takeTestActions.setIsEnded(true));
            onAfterSubmit();
        },
    });

    useEffect(() => {
        if (remainingTime < 0) {
            setRemainingTime(0);
            dispatch(takeTestActions.setIsEnded(true));
            if (remainingIntervalRef.current)
                clearInterval(remainingIntervalRef.current);
            mutate();
        }
    }, [remainingTime, mutate, dispatch]);

    useEffect(() => {
        if (!test || answers.length > 0) return;
        dispatch(takeTestActions.initAnswers());
    }, [test, dispatch, answers]);

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
            if (remainingIntervalRef.current) {
                clearInterval(remainingIntervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        remainingIntervalRef.current = setInterval(() => {
            setRemainingTime((prev) => prev - 1000);
        }, 1000);
    }, [setRemainingTime, remainingIntervalRef]);

    return (
        <div>
            <RemainingTime
                remainingTime={remainingTime}
                totalTime={test!.duration * 60 * 1000}
            />
            <div className="py-8 px-8">
                <div className="space-y-1">
                    {test!.num_parts > 1 &&
                        test!.parts.map((part) => {
                            return (
                                <div key={part.id} className="">
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
                                                    key={question.id}
                                                />
                                            ))}
                                    </div>
                                </div>
                            );
                        })}
                    {test!.num_parts <= 1 &&
                        test!.questions!.map((question) => (
                            <Question question={question} key={question.id} />
                        ))}

                    <div className="flex flex-col items-center justify-center">
                        <Button
                            size="lg"
                            onClick={handleSubmit}
                            disabled={!submittable || isLoading}
                        >
                            {isLoading ? "Submitting..." : "Submit"}
                        </Button>
                        <p className="text-sm text-gray-500 italic mt-1">
                            Make sure you have completed all the questions
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoingTest;
