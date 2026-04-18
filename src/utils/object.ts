export function pickFieldsFromObject<T extends object>(
    source: T,
    template: any,
): T {
    let result = JSON.parse(JSON.stringify(template));

    for (const key in template) {
        if (key in source) {
            result[key as keyof T] = source[key as keyof T];
        }
    }

    return result;
}

export function isEmpty(value: any): boolean {
    // Check for null or undefined
    if (value == null) {
        return true;
    }

    // Check for an empty string (trimmed)
    if (typeof value === "string" && value.trim() === "") {
        return true;
    }

    // Check for an empty array
    if (Array.isArray(value) && value.length === 0) {
        return true;
    }

    // Check for an empty object (no own enumerable keys)
    if (
        typeof value === "object" &&
        value.constructor === Object &&
        Object.keys(value).length === 0
    ) {
        return true;
    }

    // If none of the conditions match, the value is not empty
    return false;
}

export const getQueryString = (params?: Record<string, any>) => {
    if (!params || Object.keys(params).length === 0) return "";

    const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

    return `?${queryString}`;
};
