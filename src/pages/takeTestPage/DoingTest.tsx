import { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { submitAnswers } from "../../services/test";
import { toast } from "react-toastify";
import RemainingTime from "./components/RemainingTime";
import Swal from "sweetalert2";
import Button from "../../components/elements/Button";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../stores/takeTest";
import { TOAST_MESSAGES } from "../../config/constants/toasts";
import { MUTATION_KEYS } from "../../config/constants/queryMutationKeys";
import { useAppSelector } from "../../hooks/hooks";
import QuestionsPagination from "./components/Pagination";
import InfoModal from "../../components/modals/InfoModal";

type DoingTestProps = {
    onAfterSubmit: () => void;
};

const DoingTest = ({ onAfterSubmit }: DoingTestProps) => {
    const { answers, startTime, test, submittable } = useAppSelector(
        (state) => state.takeTest
    );
    const [showWarning, setShowWarning] = useState(false);
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
        onSuccess: (data: any) => {
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

    const handleVisibilityChange = () => {
        if (document.hidden) {
            setShowWarning(true);
        }
    };

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

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
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
            {test && (
                <>
                    <RemainingTime
                        remainingTime={remainingTime}
                        totalTime={test!.duration * 60 * 1000}
                    />
                    <div className="py-8 px-8">
                        <QuestionsPagination />
                        <div className="space-y-1">
                            <div className="flex flex-col items-center justify-center">
                                <Button
                                    size="lg"
                                    onClick={handleSubmit}
                                    disabled={!submittable || isLoading}
                                >
                                    {isLoading ? "Submitting..." : "Submit"}
                                </Button>
                                <p className="text-sm text-gray-500 italic mt-1">
                                    Make sure you have completed all the
                                    questions
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {showWarning && (
                <InfoModal
                    title="Warning"
                    onClose={() => setShowWarning(false)}
                >
                    <p>Tab switch detected!</p>
                    <p>
                        You are not allowed to left the test page while taking
                        test!
                    </p>
                </InfoModal>
            )}
        </div>
    );
};

export default DoingTest;
