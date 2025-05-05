import { QuestionContentItf, QuestionItf } from "../types/types";

export const sortQuestionFn = (
    a: QuestionItf<QuestionContentItf>,
    b: QuestionItf<QuestionContentItf>
) => {
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

    questionsToModified.sort(sortQuestionFn);
    return questionsToModified;
};

export const removeQuestion = (
    questions: QuestionItf<QuestionContentItf>[],
    index: number
) => {
    const questionsToModified = JSON.parse(
        JSON.stringify(questions)
    ) as QuestionItf<QuestionContentItf>[];

    if (index < questions.length) {
        for (let i = index + 1; i < questions.length; i++) {
            questionsToModified[i].order -= 1;
        }
    }
    questionsToModified.splice(index, 1);
    return questionsToModified;
};

export const addQuestion = (
    questions: QuestionItf<QuestionContentItf>[],
    questionToAdd: QuestionItf<QuestionContentItf>,
    index: number
) => {
    console.log(questions.length, questionToAdd, index);
    const questionsToModified = JSON.parse(
        JSON.stringify(questions)
    ) as QuestionItf<QuestionContentItf>[];

    if (index < questions.length) {
        for (let i = index; i < questions.length; i++) {
            questionsToModified[i].order += 1;
        }
    }
    questionsToModified.splice(index, 0, questionToAdd);
    questionsToModified.sort(sortQuestionFn);
    return questionsToModified;
};

export const sortQuestionsByOrder = (
    questions: QuestionItf<QuestionContentItf>[]
) => {
    const questionsToSort = JSON.parse(
        JSON.stringify(questions)
    ) as QuestionItf<QuestionContentItf>[];
    questionsToSort.sort(sortQuestionFn);
    return questionsToSort;
};
