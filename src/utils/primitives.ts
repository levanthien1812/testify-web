export const getNum = (number: any): number => {
    if (typeof number === "undefined" || number === null || isNaN(number)) {
        return 0;
    }
    return parseInt(number);
};
