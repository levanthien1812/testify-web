export const getNum = (number: any): number => {
    if (typeof number === "undefined" || number === null || isNaN(number)) {
        return 0;
    }
    return parseInt(number);
};

export const getRound = (number: Number, decimals: number = 2): number => {
    return parseFloat(number.toFixed(decimals));
};
