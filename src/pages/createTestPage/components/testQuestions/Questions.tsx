import React, { useEffect, useMemo, useRef } from "react";
import {
    QuestionContentItf,
    QuestionItf,
    TestPartItf,
} from "../../../../types/types";
import Question from "./Question";
import Answer from "../testAnswers/Answer";
import Accordion from "../../../../components/accordions/Accordion";
import { useAppSelector } from "../../../../hooks/hooks";
import { setEqualHeight } from "../../../../utils/components";
import { getRound } from "../../../../utils/primitives";

const Questions: React.FC<{
    part?: TestPartItf;
    withAnswer?: boolean;
}> = ({ part, withAnswer = false }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { testQuestions } = useAppSelector((state) => state.createTest);
    const audioElement = useRef<HTMLAudioElement>(null);

    const questions = useMemo(() => {
        if (part) {
            return part.questions;
        } else {
            return testQuestions;
        }
    }, [part, testQuestions]);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setEqualHeight(containerRef.current, ".grid-item");
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [questions]);

    const playAudio = () => {
        if (audioElement.current) {
            audioElement.current.play();
        }
    };

    return (
        <>
            <audio
                ref={audioElement}
                src="/sounds/button_click_fast_wooden_organic.mp3"
                preload="auto"
            />
            {part && (
                <Accordion
                    viewData={{
                        title: {
                            text: `Part ${part.order}: ${part.name}`,
                            description: {
                                text: `Score: ${getRound(
                                    part.score
                                )} | Questions: ${part.num_questions}`,
                            },
                        },
                    }}
                >
                    <div
                        className={`px-4 py-4 ${
                            !withAnswer
                                ? "grid grid-cols-3 gap-2 auto-rows-[minmax(60px,auto)]"
                                : "space-y-2"
                        } `}
                        ref={containerRef}
                    >
                        {questions &&
                            questions.length > 0 &&
                            questions.map((question, index) =>
                                !withAnswer ? (
                                    <Question
                                        question={question}
                                        part={part}
                                        key={question.id || index}
                                        playAudio={playAudio}
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
                <div
                    className="px-4 py-4 grid grid-cols-3 gap-2"
                    ref={containerRef}
                >
                    {questions &&
                        questions.map((question) => (
                            <Question
                                question={question}
                                key={question.id}
                                playAudio={playAudio}
                            />
                        ))}{" "}
                </div>
            )}
        </>
    );
};

export default Questions;
