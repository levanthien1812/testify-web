import { useCallback } from "react";
import { AnswerContentItf, TestItf, UserAnswerItf } from "../../../types/types";
import QuestionWithAnswer from "./QuestionWithAnswer";

type TestQuestionsAndAnswersProps = {
    test: TestItf;
    userAnswers: UserAnswerItf<AnswerContentItf>[] | undefined;
    includeUserAnswers?: boolean;
};

const TestQuestionsAndAnswers = ({
    test,
    userAnswers,
    includeUserAnswers = true,
}: TestQuestionsAndAnswersProps) => {
    const getUserAnswer = useCallback(
        (questionId: string) => {
            if (!userAnswers || userAnswers.length === 0 || !includeUserAnswers)
                return null;
            return userAnswers.find(
                (answer) => answer.question_id === questionId
            );
        },
        [userAnswers, includeUserAnswers]
    );

    return (
        <div className="">
            {test.num_parts > 1 && test.parts && (
                <div className="space-y-4">
                    {test.parts.map((part) => {
                        return (
                            <div key={part.id} className="">
                                <div className="text-lg bg-gray-200 px-2 sm:px-4 py-1">
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
                                            <QuestionWithAnswer
                                                key={question.id}
                                                question={question}
                                                userAnswer={getUserAnswer(
                                                    question.id!
                                                )}
                                                includeUserAnswers={
                                                    includeUserAnswers
                                                }
                                            />
                                        ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {test.num_parts === 0 &&
                test.questions &&
                test.questions.map((question) => (
                    <QuestionWithAnswer
                        question={question}
                        key={question.id}
                        userAnswer={getUserAnswer(question.id!)}
                        includeUserAnswers={includeUserAnswers}
                    />
                ))}
        </div>
    );
};

export default TestQuestionsAndAnswers;
