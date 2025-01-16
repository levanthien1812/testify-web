import { useEffect, useMemo, useState } from "react";
import {
    FillGapsAnswerItf,
    FillGapsQuestionItf,
    MatchingAnswerItf,
    MatchingQuestionItf,
    MultipleChoiceQuestionItf,
    MultipleChoiceAnswerItf,
    QuestionItf,
    ResponseAnswerItf,
    ResponseQuestionItf,
    QuestionContentItf,
    UserAnswerItf,
    AnswerBodyContentItf,
} from "../../../types/types";
import { MANUAL_SCORE_TYPES, ROLES } from "../../../config/config";
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
import Button from "../../../components/elements/Button";
import Input from "../../../components/elements/Input";
import { QUESTION_TYPE } from "../../../config/constants/tests";

type QuestionProps = {
    question: QuestionItf<QuestionContentItf>;
    answer?: UserAnswerItf<AnswerBodyContentItf>;
};

const Answer = ({ question, answer }: QuestionProps) => {
    const [manualScore, setManualScore] = useState<number>(
        answer ? answer.score || 0 : 0
    );
    const [isUpdatingScore, setIsUpdatingScore] = useState<boolean>(false);
    const user = useSelector((state: RootState) => state.auth.user);

    const needManualScore = useMemo(() => {
        return MANUAL_SCORE_TYPES.includes(question.type);
    }, [question]);

    const { mutate: updateScoreMutate, isLoading: updateScoreLoading } =
        useMutation({
            mutationFn: async () => {
                const data = await updateTakerAnswer(
                    question.test_id,
                    answer!.id!,
                    { score: manualScore! }
                );

                return data;
            },
            mutationKey: ["updateTakerAnswer", { answer_id: answer?.id }],
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
                needManualScore && answer && !answer.score
                    ? "bg-orange-100"
                    : "bg-white"
            }`}
        >
            <div>
                <span className="underline">Question {question.order}:</span>{" "}
                <span className="font-bold italic">
                    (
                    {answer
                        ? `${answer.score}/${question.score}`
                        : answer === null
                        ? `0/${question.score}`
                        : question.score}{" "}
                    points)
                </span>{" "}
                {answer !== undefined && !needManualScore && (
                    <span className="font-bold italic">
                        {answer !== null ? (
                            answer.score! > 0 ? (
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
            {question.type === QUESTION_TYPE.MULTIPLE_CHOICES && (
                <MultipleChoicesAnswer
                    questionContent={
                        question.content as MultipleChoiceQuestionItf
                    }
                    answerContent={answer?.content as MultipleChoiceAnswerItf}
                />
            )}
            {question.type === QUESTION_TYPE.FILL_IN_THE_GAPS && (
                <FillGapsAnswer
                    questionContent={question.content as FillGapsQuestionItf}
                    answerContent={answer?.content as FillGapsAnswerItf}
                />
            )}
            {question.type === QUESTION_TYPE.MATCHING && (
                <MatchingAnswer
                    questionContent={question.content as MatchingQuestionItf}
                    answerContent={answer?.content as MatchingAnswerItf}
                />
            )}
            {question.type === QUESTION_TYPE.RESPONSE && (
                <ResponseAnswer
                    questionContent={question.content as ResponseQuestionItf}
                    answerContent={answer?.content as ResponseAnswerItf}
                />
            )}

            {user?.role === ROLES.MAKER && needManualScore && (
                <div className="border-t pt-2 border-gray-400 border-dashed space-x-2">
                    {((answer && !answer.score) || isUpdatingScore) && (
                        <>
                            <label htmlFor="manualScore">Score: </label>
                            <Input
                                type="number"
                                name="manualScore"
                                id="manualScore"
                                step={0.01}
                                min={0.0}
                                max={question.score}
                                className="grow "
                                sizing="sm"
                                value={manualScore}
                                onChange={(e) =>
                                    setManualScore(parseFloat(e.target.value))
                                }
                            />

                            <Button
                                onClick={handleUpdateScore}
                                disabled={updateScoreLoading}
                                size="sm"
                            >
                                {updateScoreLoading ? "Saving..." : "Save"}
                            </Button>

                            {isUpdatingScore && (
                                <Button
                                    primary={false}
                                    size="sm"
                                    onClick={() => {
                                        setManualScore(
                                            answer ? answer.score || 0 : 0
                                        );
                                        setIsUpdatingScore(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                        </>
                    )}
                    {answer && answer.score && !isUpdatingScore && (
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
