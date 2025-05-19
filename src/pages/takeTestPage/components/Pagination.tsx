import React, { useEffect, useMemo, useState } from "react";
import { PAGINATION_MODE } from "../../../config/constants/tests";
import { useAppSelector } from "../../../hooks/hooks";
import {
    QuestionContentItf,
    QuestionItf,
    TestPartItf,
} from "../../../types/types";
import { sortQuestionsByOrder } from "../../../utils/test";
import Question from "./Question";
import Button from "../../../components/elements/Button";

const QuestionsPagination = () => {
    const { test } = useAppSelector((state) => state.takeTest);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPartIndex, setCurrentPartIndex] = useState<number>(0);

    const totolPages = useMemo(() => {
        switch (test?.options.pagination_mode.mode) {
            case PAGINATION_MODE.ALL:
                return 1;
            case PAGINATION_MODE.ONE_QUESTION:
                if (test.num_parts > 1)
                    return test.parts.reduce(
                        (totalQuestions, part) =>
                            totalQuestions + part.num_questions,
                        0
                    );
                return test.num_questions;
            case PAGINATION_MODE.ONE_PARTS:
                return test.num_parts;
            case PAGINATION_MODE.FIXED_PER_PAGE:
                return Math.ceil(
                    test.num_questions /
                        (test.options.pagination_mode.questions_per_page || 1)
                );
        }
        return 1;
    }, [test]);

    const currentContent = useMemo<{
        parts?: TestPartItf[];
        questions?: QuestionItf<QuestionContentItf>[];
    } | null>(() => {
        if (!test) return null;

        switch (test.options.pagination_mode.mode) {
            case PAGINATION_MODE.ALL: {
                if (test.num_parts > 1) {
                    return { parts: test.parts };
                } else {
                    return { questions: test.questions };
                }
            }
            case PAGINATION_MODE.ONE_PARTS: {
                return { parts: [test.parts[currentPage - 1]] };
            }
            case PAGINATION_MODE.ONE_QUESTION: {
                if (test.num_parts > 1) {
                    const precQuestionsCount = test.parts
                        .filter((part, index) => index < currentPartIndex)
                        .reduce((totalQuestions, part) => {
                            return totalQuestions + part.num_questions;
                        }, 0);

                    return {
                        parts: [
                            {
                                ...test.parts[currentPartIndex],
                                questions: [
                                    test.parts[currentPartIndex].questions![
                                        currentPage - precQuestionsCount - 1
                                    ],
                                ],
                            },
                        ],
                    };
                } else {
                    return { questions: [test.questions![currentPage - 1]] };
                }
            }
            case PAGINATION_MODE.FIXED_PER_PAGE: {
                if (
                    !test.questions ||
                    test.questions.length === 0 ||
                    !test.options.pagination_mode.questions_per_page
                )
                    return null;
                if (test.num_parts <= 1) {
                    return {
                        questions: test.questions.slice(
                            (currentPage - 1) *
                                test.options.pagination_mode
                                    .questions_per_page +
                                1,
                            currentPage *
                                test.options.pagination_mode.questions_per_page
                        ),
                    };
                }
            }
        }

        return null;
    }, [test, currentPage, currentPartIndex]);

    const handleClickNext = () => {
        if (currentPage === totolPages) return;

        if (
            test &&
            test.num_parts > 1 &&
            test.options.pagination_mode.mode === PAGINATION_MODE.ONE_QUESTION
        ) {
            const accumulatedQuestionsCount = test.parts
                .filter((part, index) => index <= currentPartIndex)
                .reduce((totalQuestions, part) => {
                    return totalQuestions + part.num_questions;
                }, 0);

            if (
                currentPage + 1 > accumulatedQuestionsCount &&
                currentPartIndex < test.num_parts - 1
            ) {
                setCurrentPartIndex((prev) => prev + 1);
            }
        }

        setCurrentPage((prev) => prev + 1);
    };

    const handleClickPrevious = () => {
        if (currentPage === 1) return;
        setCurrentPage((prev) => prev - 1);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    return (
        <div>
            {currentContent &&
                currentContent.parts &&
                currentContent.parts.map((part) => {
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
                                    sortQuestionsByOrder(part.questions).map(
                                        (question) => (
                                            <Question
                                                question={question}
                                                key={question.id}
                                            />
                                        )
                                    )}
                            </div>
                        </div>
                    );
                })}
            {currentContent &&
                !currentContent.parts &&
                sortQuestionsByOrder(currentContent.questions!).map(
                    (question) => (
                        <Question question={question} key={question.id} />
                    )
                )}
            {totolPages > 1 && (
                <div className="flex justify-between mt-4">
                    <Button
                        className=""
                        size="sm"
                        primary={true}
                        onClick={handleClickPrevious}
                        disabled={
                            !test?.options.pagination_mode
                                .allow_back_navigation || currentPage === 1
                        }
                    >
                        Previous
                    </Button>
                    <span className="text-sm">
                        Page {currentPage} of {totolPages}
                    </span>
                    <Button
                        className=""
                        size="sm"
                        primary={true}
                        onClick={handleClickNext}
                        disabled={currentPage === totolPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default QuestionsPagination;
