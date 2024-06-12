import { useState, useEffect } from "react";

function useLocalStorage(key: string, initialValue: string) {
    // State to store the value
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error parsing JSON, return initial value
            console.error("Error parsing local storage item:", error);
            return initialValue;
        }
    });

    // Effect to update local storage when storedValue changes
    useEffect(() => {
        try {
            // Store the new value in local storage
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error("Error storing local storage item:", error);
        }
    }, [key, storedValue]);

    // Return the stored value and a function to update it
    return [storedValue, setStoredValue];
}

export default useLocalStorage;
