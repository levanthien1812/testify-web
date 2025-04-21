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
