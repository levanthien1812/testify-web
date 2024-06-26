import { useEffect, useMemo, useState } from "react";
import {
    FillGapsAnswerItf,
    FillGapsQuestionItf,
    MatchingAnswerItf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
    MultipleChoicesAnswerItf,
    QuestionItf,
    ResponseAnswerItf,
    ResponseQuestionItf,
} from "../../../types/types";
import { manualScoreTypes, questionTypes, roles } from "../../../config/config";
import MultipleChoicesAnswer from "./MultipleChoicesAnswer";
import FillGapsAnswer from "./FillGapsAnswer";
import MatchingAnswer from "./MatchingAnswer";
import ResponseAnswer from "./ResponseAnswer";
import { useMutation } from "react-query";
import { updateTakerAnswer } from "../../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import Button from "../../authPage/components/Button";

type QuestionProps = {
    question: QuestionItf;
};

const Answer = ({ question }: QuestionProps) => {
    const [manualScore, setManualScore] = useState<number>(
        question.answer ? question.answer.score || 0 : 0
    );
    const [isUpdatingScore, setIsUpdatingScore] = useState<boolean>(false);
    const user = useSelector((state: RootState) => state.auth.user);

    const needManualScore = useMemo(() => {
        return manualScoreTypes.includes(question.type);
    }, [question]);

    const { mutate: updateScoreMutate, isLoading: updateScoreLoading } =
        useMutation({
            mutationFn: async () => {
                const data = await updateTakerAnswer(
                    question.test_id,
                    question.answer!._id,
                    { score: manualScore! }
                );

                return data;
            },
            mutationKey: [
                "updateTakerAnswer",
                { answer_id: question.answer?._id },
            ],
            onSuccess: () => {},
            onError: (error) => {
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data.message);
                }
            },
        });

    const handleUpdateScore = () => {
        if (manualScore > question.score) {
            setManualScore(0);
            return toast.error(
                "Please enter a score less than the question score"
            );
        }
        updateScoreMutate();
    };

    return (
        <div
            className={`px-4 py-2 ${
                needManualScore && question.answer && !question.answer.score
                    ? "bg-orange-100"
                    : "bg-white"
            }`}
        >
            <div>
                <span className="underline">Question {question.order}:</span>{" "}
                <span className="font-bold italic">
                    (
                    {question.answer
                        ? `${question.answer.score}/${question.score}`
                        : question.score}{" "}
                    points)
                </span>{" "}
                {question.answer !== undefined && !needManualScore && (
                    <span className="font-bold italic">
                        {question.answer !== null ? (
                            question.answer.score! > 0 ? (
                                <span className="text-green-600">
                                    Correct ✅
                                </span>
                            ) : (
                                <span className="text-red-600">Wrong ❌</span>
                            )
                        ) : (
                            "No answer"
                        )}
                    </span>
                )}
            </div>
            {question.type === questionTypes.MULITPLE_CHOICES && (
                <MultipleChoicesAnswer
                    content={question.content as MultipleChoiceQuestionItf}
                    userAnswer={
                        question.answer
                            ? (question.answer
                                  .content as MultipleChoicesAnswerItf)
                            : null
                    }
                />
            )}
            {question.type === questionTypes.FILL_GAPS && (
                <FillGapsAnswer
                    content={question.content as FillGapsQuestionItf}
                    userAnswer={
                        question.answer
                            ? (question.answer.content as FillGapsAnswerItf)
                            : null
                    }
                />
            )}
            {question.type === questionTypes.MATCHING && (
                <MatchingAnswer
                    content={question.content as MatchingQuestionItf}
                    userAnswer={
                        question.answer
                            ? (question.answer.content as MatchingAnswerItf)
                            : null
                    }
                />
            )}
            {question.type === questionTypes.RESPONSE && (
                <ResponseAnswer
                    content={question.content as ResponseQuestionItf}
                    userAnswer={
                        question.answer
                            ? (question.answer.content as ResponseAnswerItf)
                            : null
                    }
                />
            )}

            {user?.role === roles.MAKER && needManualScore && (
                <div className="border-t pt-2 border-gray-400 border-dashed">
                    {((question.answer && !question.answer.score) ||
                        isUpdatingScore) && (
                        <>
                            <label htmlFor="manualScore">Score: </label>
                            <input
                                type="number"
                                name="manualScore"
                                id="manualScore"
                                step={0.01}
                                min={0.0}
                                max={question.score}
                                className="border border-gray-500 px-2 grow focus:border-orange-600 outline-none leading-6 ms-2"
                                value={manualScore}
                                onChange={(e) =>
                                    setManualScore(parseFloat(e.target.value))
                                }
                            />

                            <Button
                                onClick={handleUpdateScore}
                                disabled={updateScoreLoading}
                            >
                                {updateScoreLoading ? "Saving..." : "Save"}
                            </Button>

                            {isUpdatingScore && (
                                <Button
                                    primary={false}
                                    className="ms-2"
                                    size="sm"
                                    onClick={() => {
                                        setManualScore(
                                            question.answer
                                                ? question.answer.score || 0
                                                : 0
                                        );
                                        setIsUpdatingScore(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                        </>
                    )}
                    {question.answer &&
                        question.answer.score &&
                        !isUpdatingScore && (
                            <Button
                                size="sm"
                                onClick={() => setIsUpdatingScore(true)}
                            >
                                Update score
                            </Button>
                        )}
                </div>
            )}
        </div>
    );
};

export default Answer;
