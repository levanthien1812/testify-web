import {
    INITIAL_PART,
    INITIAL_QUESTION,
} from "../../config/constants/initialValues";
import { PASSCODE_METHOD } from "../../config/constants/passcode";
import {
    QUESTION_NUMBERING_METHOD,
    SHARE_OPTIONS,
} from "../../config/constants/tests";
import {
    PasscodeItf,
    QuestionContentItf,
    QuestionItf,
    TestItf,
    TestPartItf,
} from "../../types/types";
import {
    findSmallestMissingPositive,
    generateArrayFromStart,
} from "../../utils/array";
import { checkQuestionAnswerIsSaved, sortByOrderFn } from "../../utils/test";

export const initializeParts = (
    existingParts: TestPartItf[],
    numParts: number,
    testId: string,
    questionNumberingMethod?: QUESTION_NUMBERING_METHOD,
) => {
    let updatedParts = [...existingParts];

    if (numParts > 1 && existingParts.length === 0) {
        updatedParts = [...Array(numParts)].map((item, index) => ({
            ...INITIAL_PART,
            order: index + 1,
            test_id: testId,
        }));
    }
    if (existingParts.length > 0) {
        let startOrder = 1;
        updatedParts.sort(sortByOrderFn).map((part) => {
            const questions = initializeQuestions(
                part.questions || [],
                part.num_questions,
                testId,
                part.id,
                startOrder,
            );

            if (
                questionNumberingMethod === QUESTION_NUMBERING_METHOD.CONTINUOUS
            ) {
                startOrder += questions.length;
            }
            return { ...part, questions };
        });
    }

    if (numParts > existingParts.length) {
        updatedParts = [
            ...existingParts,
            ...[...Array(numParts - existingParts.length)].map(
                (item, index) => ({
                    ...INITIAL_PART,
                    order: existingParts.length + (index + 1),
                    test_id: testId,
                }),
            ),
        ];
    }

    return updatedParts;
};

export const initializeQuestions = (
    existingQuestions: QuestionItf<QuestionContentItf>[],
    numQuestions: number,
    testId: string,
    partId?: string,
    startOrder?: number,
) => {
    let updatedQuestions = [...existingQuestions];

    if (existingQuestions.length === 0) {
        const orderArray = generateArrayFromStart(
            startOrder || 1,
            numQuestions,
        );
        updatedQuestions = orderArray.map((order) => {
            return {
                ...INITIAL_QUESTION,
                test_id: testId,
                ...(partId ? { part_id: partId } : {}),
                order: order,
            };
        });
    } else {
        if (existingQuestions.length < numQuestions) {
            let existingOrderArray = existingQuestions.map(
                (question) => question.order,
            );

            updatedQuestions = [
                ...existingQuestions,
                ...[...Array(numQuestions - existingQuestions.length)].map(
                    () => {
                        const missingOrder = findSmallestMissingPositive(
                            existingOrderArray,
                            startOrder,
                        );
                        existingOrderArray.push(missingOrder);
                        return {
                            ...INITIAL_QUESTION,
                            test_id: testId,
                            ...(partId ? { part_id: partId } : {}),
                            order: missingOrder,
                        };
                    },
                ),
            ];
        }

        updatedQuestions = initializeAnswers(updatedQuestions);

        updatedQuestions.sort(sortByOrderFn);
    }
    return updatedQuestions;
};

export const initializeAnswers = (
    existingQuestions: QuestionItf<QuestionContentItf>[],
) => {
    let updatedQuestions = [...existingQuestions];
    if (existingQuestions.length > 0)
        updatedQuestions = existingQuestions.map((question) => {
            if (question.content && question.content.answer) {
                question.content.answer.is_saved =
                    checkQuestionAnswerIsSaved(question);
            }
            return question;
        });
    return updatedQuestions;
};

export const validateTestInfo = (
    testInfo: Required<
        Pick<
            TestItf,
            | "title"
            | "datetime"
            | "duration"
            | "max_score"
            | "num_questions"
            | "num_parts"
        >
    >,
) => {
    const isValidTestInfo =
        testInfo.title.length > 0 &&
        testInfo.datetime.length > 0 &&
        testInfo.duration > 0 &&
        testInfo.max_score > 0 &&
        testInfo.num_questions > 0 &&
        (testInfo.num_parts === 0 || testInfo.num_parts > 1);
    return isValidTestInfo;
};

export const validateParts = (
    parts: TestPartItf[],
    numParts: number,
    numQuestions: number,
    maxScore: number,
) => {
    let isValidParts = false;
    if (numParts === 0) isValidParts = true;
    else {
        let isEqualTotalScores = false;
        let isEqualNumberQuestions = false;
        const totalPartsScores = parts.reduce(
            (total, curr) => curr.score + total,
            0,
        );
        if (
            totalPartsScores === maxScore &&
            parts.every((part) => part.num_questions > 0)
        ) {
            isEqualTotalScores = true;
        }

        const totalPartsQuestions = parts.reduce(
            (total, curr) => total + curr?.num_questions,
            0,
        );
        if (
            totalPartsQuestions === numQuestions &&
            parts.every((part) => part.num_questions > 0)
        ) {
            isEqualNumberQuestions = true;
        }
        isValidParts = isEqualTotalScores && isEqualNumberQuestions;
    }
    return isValidParts;
};

export const validateQuestions = (
    parts: TestPartItf[],
    questions: QuestionItf<QuestionContentItf>[],
    numQuestions: number,
    maxScore: number,
) => {
    let isValidQuestions = false;
    if (questions.length === 0) {
        isValidQuestions = parts.every((part) => {
            let isEqualTotalScores = false;
            let isEqualNumberQuestions = false;
            const totalQuestionsScore = part?.questions?.reduce(
                (total, curr) => curr.score + total,
                0,
            );
            if (totalQuestionsScore === part?.score) {
                isEqualTotalScores = true;
            }
            const totalQuestionsNumber = part?.questions?.length;
            if (totalQuestionsNumber === part.num_questions) {
                isEqualNumberQuestions = true;
            }
            return isEqualTotalScores && isEqualNumberQuestions;
        });
    } else if (questions.length > 0) {
        let isEqualTotalScores = false;
        let isEqualNumberQuestions = false;
        const totalQuestionsScore = questions.reduce(
            (total, curr) => curr.score + total,
            0,
        );
        if (totalQuestionsScore === maxScore) {
            isEqualTotalScores = true;
        }
        const totalQuestionsNumber = questions.filter(
            (question) => question.is_content_provided,
        ).length;

        if (totalQuestionsNumber === numQuestions) {
            isEqualNumberQuestions = true;
        }
        // console.log({ isEqualTotalScores, isEqualNumberQuestions });
        isValidQuestions = isEqualTotalScores && isEqualNumberQuestions;
    }
    return isValidQuestions;
};

export const validateAnswers = () => {
    return true;
};

export const validateShareOption = (
    shareOption: SHARE_OPTIONS | undefined,
    noOfSelectedTakers: number,
    passcode: PasscodeItf,
) => {
    let isValidShareOption = false;
    switch (shareOption) {
        case SHARE_OPTIONS.RESTRICTED: {
            if (noOfSelectedTakers > 0) {
                isValidShareOption = true;
            }
            break;
        }
        case SHARE_OPTIONS.ANYONE: {
            isValidShareOption = true;
            break;
        }
        case SHARE_OPTIONS.PASSCODE: {
            if (
                passcode.method === PASSCODE_METHOD.AUTO_GENERATED &&
                passcode.format &&
                passcode.code
            ) {
                isValidShareOption = true;
            }
            if (
                passcode.method === PASSCODE_METHOD.MANUALLY_ENTERED &&
                passcode.code
            ) {
                isValidShareOption = true;
            }
            break;
        }
    }
    return isValidShareOption;
};
