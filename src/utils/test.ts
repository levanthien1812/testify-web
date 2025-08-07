import {
    QUESTION_NUMBERING_METHOD,
    QUESTION_TYPE,
} from "../config/constants/tests";
import {
    FillGapsAnswerItf,
    MatchingAnswerItf,
    MultipleChoiceAnswerItf,
    QuestionContentItf,
    QuestionItf,
    TrueFalseAnswerItf,
} from "../types/types";

export const sortByOrderFn = <T extends { order: number }>(a: T, b: T) => {
    if (a.order < b.order) {
        return -1;
    }
    if (a.order > b.order) {
        return 1;
    }
    return 0;
};

export const reorderQuestions = (
    originalQuestions: QuestionItf<QuestionContentItf>[],
    startIndex: number,
    endIndex: number
) => {
    const questionsToModified = JSON.parse(
        JSON.stringify(originalQuestions)
    ) as QuestionItf<QuestionContentItf>[];

    if (startIndex < endIndex) {
        for (let i = startIndex + 1; i <= endIndex; i++) {
            questionsToModified[i].order -= 1;
        }
    } else {
        for (let i = startIndex - 1; i >= endIndex; i--) {
            questionsToModified[i].order += 1;
        }
    }
    questionsToModified[startIndex].order = originalQuestions[endIndex].order;

    questionsToModified.sort(sortByOrderFn);
    return questionsToModified;
};

export const removeQuestion = (
    questions: QuestionItf<QuestionContentItf>[],
    index: number,
    moveDirection?: "up" | "down",
    numberingMethod?: QUESTION_NUMBERING_METHOD
) => {
    const questionsToModified = JSON.parse(
        JSON.stringify(questions)
    ) as QuestionItf<QuestionContentItf>[];

    if (index < questions.length) {
        if (
            numberingMethod === QUESTION_NUMBERING_METHOD.CONTINUOUS &&
            moveDirection === "up"
        ) {
            for (let i = 0; i < index; i++) {
                questionsToModified[i].order += 1;
            }
        } else {
            for (let i = index + 1; i < questions.length; i++) {
                questionsToModified[i].order -= 1;
            }
        }
    }
    questionsToModified.splice(index, 1);
    return questionsToModified;
};

export const addQuestion = (
    questions: QuestionItf<QuestionContentItf>[],
    questionToAdd: QuestionItf<QuestionContentItf>,
    index: number,
    moveDirection?: "up" | "down",
    numberingMethod?: QUESTION_NUMBERING_METHOD
) => {
    const questionsToModified = JSON.parse(
        JSON.stringify(questions)
    ) as QuestionItf<QuestionContentItf>[];

    if (index < questions.length) {
        if (
            numberingMethod === QUESTION_NUMBERING_METHOD.CONTINUOUS &&
            moveDirection === "down"
        ) {
            for (let i = 0; i <= index; i++) {
                questionsToModified[i].order -= 1;
            }
        } else {
            for (let i = index; i < questions.length; i++) {
                questionsToModified[i].order += 1;
            }
        }
    }
    questionsToModified.splice(index, 0, questionToAdd);
    questionsToModified.sort(sortByOrderFn);
    return questionsToModified;
};

export const changeIntermediateQuestionsOrder = (
    questions: QuestionItf<QuestionContentItf>[],
    changeType: "increase" | "decrease"
) => {
    return questions.map((question, index) => {
        return {
            ...question,
            order:
                changeType === "increase"
                    ? question.order + 1
                    : question.order - 1,
        };
    });
};

export const sortQuestionsByOrder = (
    questions: QuestionItf<QuestionContentItf>[]
) => {
    const questionsToSort = JSON.parse(
        JSON.stringify(questions)
    ) as QuestionItf<QuestionContentItf>[];
    questionsToSort.sort(sortByOrderFn);
    return questionsToSort;
};

export const checkQuestionAnswerIsSaved = (
    question: QuestionItf<QuestionContentItf>
) => {
    if (!question.content || !question.content.answer) return false;
    switch (question.type) {
        case QUESTION_TYPE.MULTIPLE_CHOICES: {
            const answer = question.content.answer as MultipleChoiceAnswerItf;
            return answer.options && answer.options.length > 0;
        }
        case QUESTION_TYPE.FILL_IN_THE_GAPS: {
            const answer = question.content.answer as FillGapsAnswerItf;
            return answer.gaps && answer.gaps.length > 0;
        }
        case QUESTION_TYPE.MATCHING: {
            const answer = question.content.answer as MatchingAnswerItf;
            return answer.matchings && answer.matchings.length > 0;
        }
        case QUESTION_TYPE.RESPONSE: {
            return true;
        }
        case QUESTION_TYPE.TRUE_FALSE: {
            const answer = question.content.answer as TrueFalseAnswerItf;
            return answer.is_true !== undefined;
        }
        default: {
            return false;
        }
    }
};
