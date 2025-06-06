import { useState, useEffect } from "react";

function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error("Error reading from localStorage:", error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((prevValue: T) => T)) => {
        const valueToStore =
            value instanceof Function ? value(storedValue) : value;
        try {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error("Error writing to localStorage:", error);
        }
        setStoredValue(valueToStore);
    };

    return [storedValue, setValue];
}

export default useLocalStorage;
