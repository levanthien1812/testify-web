export function generateArray(n: number) {
    const result = [];
    for (let i = 1; i <= n; i++) {
        result.push(i);
    }
    return result;
}

export function findSmallestMissingPositive(nums: number[], start = 1): number {
    const numSet = new Set(nums);
    let i = start;

    while (true) {
        if (!numSet.has(i)) {
            return i;
        }
        i++;
    }
}

export const generateEvenRanges = (totalInteger: number, numRanges: number) => {
    if (totalInteger < 0 || numRanges <= 0) {
        console.error(
            "Invalid input: totalInteger must be non-negative, and numRanges must be positive."
        );
        return [];
    }

    const result = [];
    const rangeSize = totalInteger / numRanges;

    for (let i = 0; i < numRanges; i++) {
        const start = i * rangeSize;
        const end = (i + 1) * rangeSize;

        let currentStart = Math.round(start);
        let currentEnd = Math.round(end);

        if (i === numRanges - 1) {
            currentEnd = totalInteger;
        }

        result.push([currentStart, currentEnd]);
    }

    return result;
};

export function generateArrayFromStart(
    start: number,
    total: number
): number[] {
    const result: number[] = [];
    for (let i = 0; i < total; i++) {
        result.push(start + i);
    }
    return result;
}
