import { useCallback } from "react";
import { AnswerContentItf, TestItf, UserAnswerItf } from "../../../types/types";
import Answer from "./Answer";

type TestQuestionsAndAnswersProps = {
    test: TestItf;
    userAnswers: UserAnswerItf<AnswerContentItf>[] | undefined;
};

const TestQuestionsAndAnswers = ({
    test,
    userAnswers,
}: TestQuestionsAndAnswersProps) => {
    const getUserAnswer = useCallback(
        (questionId: string) => {
            if (!userAnswers) return null;
            return userAnswers.find(
                (answer) => answer.question_id === questionId
            );
        },
        [userAnswers]
    );
    return (
        <div className="">
            {test.num_parts > 1 && test.parts && (
                <div className="space-y-4">
                    {test.parts.map((part) => {
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
                                            <Answer
                                                key={question.id}
                                                question={question}
                                                userAnswer={getUserAnswer(
                                                    question.id!
                                                )}
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
                    <Answer
                        question={question}
                        key={question.id}
                        userAnswer={getUserAnswer(question.id!)}
                    />
                ))}
        </div>
    );
};

export default TestQuestionsAndAnswers;
