export const shorten = (str: string, max_length: number = 50) => {
    if (str.length > max_length) {
        return str.slice(0, max_length) + "...";
    }
    return str;
};

export const textToSlug = (text: string): string => {
    return (
        text
            // 1. Trim leading and trailing whitespace
            .trim()
            // 2. Convert to lowercase
            .toLowerCase()
            // 3. Normalize for special characters (e.g., accents) and remove them
            // NFD (Normalization Form D) breaks characters like 'é' into 'e' and a combining accent.
            // The regex then removes the combining accent.
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            // 4. Replace any non-alphanumeric characters (except hyphens and spaces) with a space
            .replace(/[^a-z0-9\s-]/g, " ")
            // 5. Replace multiple spaces or hyphens with a single hyphen
            .replace(/[\s-]+/g, "-")
            // 6. Trim any hyphens that might be at the start or end of the string
            .replace(/^-+|-+$/g, "")
    );
};
