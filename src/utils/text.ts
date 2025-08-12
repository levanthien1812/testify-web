export const shorten = (str: string, max_length: number = 50) => {
    if (str.length > max_length) {
        return str.slice(0, max_length) + "...";
    }
    return str;
};
