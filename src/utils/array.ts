import { QuestionContentItf, QuestionItf } from "../types/types";

export function generateArray(n: number) {
    const result = [];
    for (let i = 1; i <= n; i++) {
        result.push(i);
    }
    return result;
}

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
