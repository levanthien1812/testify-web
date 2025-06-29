export const shorten = (str: string, max_length: number) => {
    if (str.length > max_length) {
        return str.slice(0, max_length) + "...";
    }
    return str;
};
