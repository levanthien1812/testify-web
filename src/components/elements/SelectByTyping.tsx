// SelectByTyping.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";

interface Option {
    value: string;
    label: string;
}

interface SelectByTypingProps {
    options: Option[];
    onSelect: (selectedValue: string) => void;
    placeholder?: string;
    excludeSelectedValues?: boolean;
    allowDuplicate?: boolean;
    selectedValues?: string[];
}

const SelectByTyping: React.FC<SelectByTypingProps> = ({
    options,
    onSelect,
    placeholder = "Type to search...",
    excludeSelectedValues = false,
    allowDuplicate = false,
    selectedValues = [],
}) => {
    const [inputValue, setInputValue] = useState<string>("");
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (inputValue) {
            const lowercasedInput = inputValue.toLowerCase();
            const newFilteredOptions = options.filter((option) =>
                option.label.toLowerCase().includes(lowercasedInput)
            );
            setFilteredOptions(newFilteredOptions);
            setShowOptions(true);
            setHighlightedIndex(-1);
        } else {
            setFilteredOptions(options);
            setShowOptions(false);
        }
    }, [inputValue, options]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setShowOptions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleOptionClick = useCallback(
        (option: Option) => {
            if (!allowDuplicate) {
                if (selectedValues.includes(option.value)) {
                    return;
                }
            }
            onSelect(option.value);
            setInputValue("");
            setShowOptions(false);
        },
        [onSelect, selectedValues, allowDuplicate]
    );

    useEffect(() => {
        if (excludeSelectedValues) {
            setFilteredOptions((prev) =>
                prev.filter((opt) => !selectedValues.includes(opt.value))
            );
        }
    }, [excludeSelectedValues, selectedValues]);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (!showOptions || filteredOptions.length === 0) return;

            switch (event.key) {
                case "ArrowDown":
                    event.preventDefault();
                    setHighlightedIndex((prevIndex) =>
                        prevIndex < filteredOptions.length - 1
                            ? prevIndex + 1
                            : 0
                    );
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    setHighlightedIndex((prevIndex) =>
                        prevIndex > 0
                            ? prevIndex - 1
                            : filteredOptions.length - 1
                    );
                    break;
                case "Enter":
                    if (highlightedIndex !== -1) {
                        handleOptionClick(filteredOptions[highlightedIndex]);
                    } else if (
                        filteredOptions.length === 1 &&
                        inputValue.toLowerCase() ===
                            filteredOptions[0].label.toLowerCase()
                    ) {
                        handleOptionClick(filteredOptions[0]);
                    }
                    setShowOptions(false);
                    break;
                case "Escape":
                    setShowOptions(false);
                    break;
                default:
                    break;
            }
        },
        [
            showOptions,
            filteredOptions,
            highlightedIndex,
            inputValue,
            handleOptionClick,
        ]
    );

    return (
        <div className="relative" ref={wrapperRef}>
            <input
                type="text"
                className="rounded-full py-1 px-2 shadow-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setShowOptions(true)}
                onKeyDown={handleKeyDown}
            />
            {showOptions && filteredOptions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {filteredOptions.map((option, index) => (
                        <li
                            key={option.value}
                            className={`px-2 py-1 cursor-pointer hover:bg-orange-100 ${
                                index === highlightedIndex ? "bg-blue-100" : ""
                            }`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
            {showOptions && filteredOptions.length === 0 && inputValue && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 p-2 text-gray-500">
                    No options found.
                </div>
            )}
        </div>
    );
};

export default SelectByTyping;
