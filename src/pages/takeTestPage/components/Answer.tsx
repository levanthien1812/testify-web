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
import {
    MANUAL_SCORE_TYPES,
    ROLES,
    USER_ANSWER_STATUS,
    USER_ANSWER_STATUS_LABEL,
} from "../../../config/constants/tests";
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
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";

type QuestionProps = {
    question: QuestionItf<QuestionContentItf>;
    userAnswer?: UserAnswerItf<AnswerBodyContentItf> | null;
};

const Answer = ({ question, userAnswer }: QuestionProps) => {
    const [manualScore, setManualScore] = useState<number>(
        userAnswer ? userAnswer.score || 0 : 0
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
                    userAnswer!.id!,
                    { score: manualScore! }
                );

                return data;
            },
            mutationKey: [
                MUTATION_KEYS.UPDATE_TAKER_ANSWER,
                { answer_id: userAnswer?.id },
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

    const points = useMemo(() => {
        if (userAnswer && userAnswer.score) {
            return `${userAnswer.score}/${question.score}`;
        }
        return question.score;
    }, [userAnswer, question.score]);

    const status = useMemo<USER_ANSWER_STATUS>(() => {
        if (userAnswer && userAnswer.is_correct === true) {
            return USER_ANSWER_STATUS.CORRECT;
        }
        if (userAnswer && userAnswer.is_correct === false) {
            return USER_ANSWER_STATUS.WRONG;
        }
        if (userAnswer === undefined || userAnswer === null) {
            return USER_ANSWER_STATUS.NOT_ANSWERED;
        }
        if (userAnswer && userAnswer.score === undefined) {
            return USER_ANSWER_STATUS.NOT_EVALUATED;
        }
        return USER_ANSWER_STATUS.NOTHING;
    }, [userAnswer]);

    return (
        <div
            className={`px-4 py-2 ${
                needManualScore && userAnswer && !userAnswer.score
                    ? "bg-orange-100"
                    : "bg-white"
            }`}
        >
            <div>
                <span className="underline">Question {question.order}:</span>{" "}
                <span className="font-bold italic">{`(${points} points)`}</span>{" "}
                <span className="italic">
                    {USER_ANSWER_STATUS_LABEL[status]}
                </span>
            </div>
            {question.type === QUESTION_TYPE.MULTIPLE_CHOICES && (
                <MultipleChoicesAnswer
                    questionContent={
                        question.content as MultipleChoiceQuestionItf
                    }
                    answerContent={
                        userAnswer?.content as MultipleChoiceAnswerItf
                    }
                    answerStatus={status}
                />
            )}
            {question.type === QUESTION_TYPE.FILL_IN_THE_GAPS && (
                <FillGapsAnswer
                    questionContent={question.content as FillGapsQuestionItf}
                    answerContent={userAnswer?.content as FillGapsAnswerItf}
                    answerStatus={status}
                />
            )}
            {question.type === QUESTION_TYPE.MATCHING && (
                <MatchingAnswer
                    questionContent={question.content as MatchingQuestionItf}
                    answerContent={userAnswer?.content as MatchingAnswerItf}
                    answerStatus={status}
                />
            )}
            {question.type === QUESTION_TYPE.RESPONSE && (
                <ResponseAnswer
                    questionContent={question.content as ResponseQuestionItf}
                    answerContent={userAnswer?.content as ResponseAnswerItf}
                />
            )}

            {user?.role === ROLES.MAKER && needManualScore && (
                <div className="border-t pt-2 border-gray-400 border-dashed space-x-2">
                    {((userAnswer && !userAnswer.score) || isUpdatingScore) && (
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
                                            userAnswer
                                                ? userAnswer.score || 0
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
                    {userAnswer && userAnswer.score && !isUpdatingScore && (
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
