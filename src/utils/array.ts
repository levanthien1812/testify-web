export function generateArray(n: number) {
    const result = [];
    for (let i = 1; i <= n; i++) {
        result.push(i);
    }
    return result;
}

export function findSmallestMissingPositive(nums: number[]): number {
    const numSet = new Set(nums);
    let i = 1;

    while (true) {
        if (!numSet.has(i)) {
            return i;
        }
        i++;
    }
}
