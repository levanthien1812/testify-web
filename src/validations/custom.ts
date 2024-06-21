import { CustomHelpers } from "joi";
import { FillGapsQuestionBodyItf } from "../types/types";

export const password = (value: string, helpers: CustomHelpers) => {
    if (value.length < 8) {
        return helpers.message({
            custom: "password must be as least 8 characters",
        });
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message({
            custom: "password must contain at least 1 letter and 1 number",
        });
    }
    return value;
};

export const numGaps = (
    value: FillGapsQuestionBodyItf,
    helpers: CustomHelpers
) => {
    const { text, num_gaps } = value;

    const gapCount = (text.match(/___/g) || []).length;

    if (gapCount !== num_gaps) {
        return helpers.message({
            custom: "Number of gaps in text does not equal to num_gaps",
        });
    }

    return value;
};
