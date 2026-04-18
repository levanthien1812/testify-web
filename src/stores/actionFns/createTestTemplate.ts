import { INITIAL_PART } from "../../config/constants/initialValues";
import { TestPartItf } from "../../types/types";
import { sortByOrderFn } from "../../utils/test";

export const initializeTemplateParts = (
    existingParts: TestPartItf[],
    numParts: number,
    templateId: string,
) => {
    console.log(existingParts);
    let updatedParts = [...existingParts];

    if (numParts > 1 && existingParts.length === 0) {
        updatedParts = [...Array(numParts)].map((item, index) => ({
            ...INITIAL_PART,
            order: index + 1,
            template_id: templateId,
        }));
    }

    if (existingParts.length > 0) {
        updatedParts.sort(sortByOrderFn);
    }

    if (numParts > existingParts.length) {
        updatedParts = [
            ...existingParts,
            ...[...Array(numParts - existingParts.length)].map(
                (item, index) => ({
                    ...INITIAL_PART,
                    order: existingParts.length + (index + 1),
                    template_id: templateId,
                }),
            ),
        ];
    }

    return updatedParts;
};
