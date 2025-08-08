export const getNum = (number: any): number => {
    if (typeof number === "undefined" || number === null || isNaN(number)) {
        return 0;
    }
    return parseInt(number);
};

export const getRound = (
    number: number | undefined,
    decimals: number = 2
): number => {
    if (!number) return 0;
    return parseFloat(number.toFixed(decimals));
};
