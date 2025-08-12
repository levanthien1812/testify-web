import React, { useMemo } from "react";
import {
    AnswerContentItf,
    QuestionContentItf,
    QuestionItf,
    UserAnswerItf,
} from "../../../types/types";
import { useAppSelector } from "../../../hooks/hooks";
import { getRound } from "../../../utils/primitives";

type Props = {
    answers: UserAnswerItf<AnswerContentItf>[];
};

const Item = ({
    questions,
    answers,
}: {
    questions: QuestionItf<QuestionContentItf>[];
    answers: UserAnswerItf<AnswerContentItf>[];
}) => {
    const maxRows = 10;

    const rows = useMemo(() => {
        let mappedQuestions: { order: number; score: number }[][] = Array.from({
            length: questions.length >= 10 ? 10 : questions.length,
        }).map(() => []);

        let numOfRows = mappedQuestions.length;
        let numOfCols = Math.ceil(questions.length / maxRows);

        for (let i = 0; i < numOfRows; i++) {
            for (let j = 0; j < numOfCols; j++) {
                const index = numOfRows * j + i;
                if (index < questions.length) {
                    const answer = answers.find(
                        (answer) => answer.question_id === questions[index].id
                    );
                    mappedQuestions[i].push({
                        order: questions[index].order,
                        score: answer?.score || 0,
                    });
                }
            }
        }

        console.log(mappedQuestions);
        return mappedQuestions.map((questions) => {
            return (
                <tr key={questions[0].order}>
                    {questions.map((question) => (
                        <>
                            <td
                                key={question.order}
                                className="text-center bg-gray-100 w-[100px] py-0 border"
                            >
                                Q{question.order}
                            </td>
                            <td
                                key={question.score}
                                className="text-center bg-white w-[100px] py-0 border"
                            >
                                {getRound(question.score)}
                            </td>
                        </>
                    ))}
                </tr>
            );
        });
    }, [questions, answers]);

    return (
        <div>
            <table>
                <tbody>{rows}</tbody>
            </table>
        </div>
    );
};

const ScoreSummary = ({ answers }: Props) => {
    const test = useAppSelector((state) => state.viewTest.test);

    return (
        <div className="border border-dashed border-gray-400 mt-4 p-2">
            <p className="text-xl text-center">Score summary</p>
            <div className="mt-2 flex gap-2 overflow-x-scroll">
                {test &&
                    test.parts.length > 1 &&
                    test.parts.map((part) => (
                        <div key={part.id} className="w-1/3 md:w-fit shrink-0">
                            <p className="bg-gray-300 text-black px-2 py-0 text-center">
                                Part {part.order}
                            </p>
                            <Item
                                questions={part.questions!}
                                answers={answers}
                            />
                        </div>
                    ))}
                {test && test.parts.length === 0 && test.questions && (
                    <Item questions={test.questions} answers={answers} />
                )}
            </div>
        </div>
    );
};

export default ScoreSummary;
