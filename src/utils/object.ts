export function pickFieldsFromObject<A extends object>(obj1: A, obj2: any): A {
    const result = obj2;

    for (const key in obj2) {
        if (key in obj1) {
            result[key as keyof A] = obj1[key as keyof A];
        }
    }

    return result;
}
