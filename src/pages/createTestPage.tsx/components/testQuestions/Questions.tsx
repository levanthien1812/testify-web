import React, { useMemo } from "react";
import {
    QuestionContentItf,
    QuestionItf,
    TestPartItf,
} from "../../../../types/types";
import Question from "./Question";
import Answer from "../testAnswers/Answer";
import Accordion from "../../../../components/accordions/Accordion";
import { useAppSelector } from "../../../../hooks/hooks";

const Questions: React.FC<{
    part?: TestPartItf;
    withAnswer?: boolean;
}> = ({ part, withAnswer = false }) => {
    const { testQuestions } = useAppSelector((state) => state.createTest);
    const questions = useMemo(() => {
        if (part) {
            return part.questions;
        } else {
            return testQuestions;
        }
    }, [part, testQuestions]);

    return (
        <>
            {part && (
                <Accordion
                    viewData={{
                        title: {
                            text: `Part ${part.order}: ${part.name}`,
                            description: {
                                text: `Score: ${part.score} | Questions: ${part.num_questions}`,
                            },
                        },
                    }}
                >
                    <div
                        className={`px-4 py-4 ${
                            !withAnswer ? "grid grid-cols-4 gap-2" : "space-y-2"
                        } `}
                    >
                        {questions &&
                            questions.length > 0 &&
                            questions.map((question, index) =>
                                !withAnswer ? (
                                    <Question
                                        question={question}
                                        part={part}
                                        key={question.id}
                                    />
                                ) : (
                                    <Answer
                                        question={
                                            question as QuestionItf<QuestionContentItf>
                                        }
                                        key={question!.content?.text}
                                    />
                                )
                            )}
                    </div>
                </Accordion>
            )}
            {!part && (
                <div className="px-4 py-4 grid grid-cols-4 gap-2">
                    {questions &&
                        questions.map((question) => (
                            <Question question={question} key={question.id} />
                        ))}{" "}
                </div>
            )}
        </>
    );
};

export default Questions;
