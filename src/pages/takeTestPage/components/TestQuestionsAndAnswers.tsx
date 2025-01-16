import { useCallback, useMemo } from "react";
import {
    AnswerBodyContentItf,
    TestItf,
    UserAnswerItf,
} from "../../../types/types";
import Answer from "./Answer";

type TestQuestionsAndAnswersProps = {
    test: TestItf;
    answers: UserAnswerItf<AnswerBodyContentItf>[];
};

const TestQuestionsAndAnswers = ({
    test,
    answers,
}: TestQuestionsAndAnswersProps) => {
    const getAnswer = useCallback(
        (questionId: string) => {
            return answers.find((answer) => answer.question_id === questionId);
        },
        [answers]
    );
    return (
        <div className="mt-4">
            {test.num_parts > 1 &&
                test.parts.map((part) => {
                    return (
                        <div key={part.id} className="">
                            <div className="text-lg bg-gray-200 px-4 py-1">
                                <span className="underline">
                                    Part {part.order}:
                                </span>{" "}
                                <span className="uppercase"> {part.name}</span>
                            </div>

                            <div>
                                {part.questions &&
                                    part.questions.map((question) => (
                                        <Answer
                                            key={question.id}
                                            question={question}
                                            answer={getAnswer(question.id!)}
                                        />
                                    ))}
                            </div>
                        </div>
                    );
                })}
            {test.num_parts <= 1 &&
                test.questions!.map((question) => (
                    <Answer
                        question={question}
                        key={question.id}
                        answer={getAnswer(question.id!)}
                    />
                ))}
        </div>
    );
};

export default TestQuestionsAndAnswers;
