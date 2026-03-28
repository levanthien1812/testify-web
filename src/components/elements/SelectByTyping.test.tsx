import { render, screen, fireEvent } from "@testing-library/react";
import SelectByTyping from "./SelectByTyping";
import React from "react";

describe("SelectByTyping", () => {
    const options = [
        { value: "opt1", label: "Option 1" },
        { value: "opt2", label: "Option 2" },
        { value: "opt3", label: "Banana" },
    ];
    const mockOnSelect = jest.fn();

    beforeEach(() => {
        mockOnSelect.mockClear();
    });

    it("should render input correctly", () => {
        render(<SelectByTyping options={options} onSelect={mockOnSelect} />);
        const input = screen.getByPlaceholderText("Type to search...");
        expect(input).toBeInTheDocument();
    });

    it("should show options on focus", () => {
        render(<SelectByTyping options={options} onSelect={mockOnSelect} />);
        const input = screen.getByPlaceholderText("Type to search...");

        fireEvent.focus(input);

        expect(screen.getByText("Option 1")).toBeInTheDocument();
        expect(screen.getByText("Option 2")).toBeInTheDocument();
        expect(screen.getByText("Banana")).toBeInTheDocument();
    });

    it("should filter options based on input", () => {
        render(<SelectByTyping options={options} onSelect={mockOnSelect} />);
        const input = screen.getByPlaceholderText("Type to search...");

        fireEvent.change(input, { target: { value: "Banana" } });

        expect(screen.getByText("Banana")).toBeInTheDocument();
        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });

    it("should show 'No options found' when no match", () => {
        render(<SelectByTyping options={options} onSelect={mockOnSelect} />);
        const input = screen.getByPlaceholderText("Type to search...");

        fireEvent.change(input, { target: { value: "Invalid" } });

        expect(screen.getByText("No options found.")).toBeInTheDocument();
    });

    it("should call onSelect when option is clicked", () => {
        render(<SelectByTyping options={options} onSelect={mockOnSelect} />);
        const input = screen.getByPlaceholderText("Type to search...");

        fireEvent.focus(input);
        fireEvent.click(screen.getByText("Option 1"));

        expect(mockOnSelect).toHaveBeenCalledWith("opt1");
        expect(input).toHaveValue("");
    });

    it("should handle keyboard navigation", () => {
        render(<SelectByTyping options={options} onSelect={mockOnSelect} />);
        const input = screen.getByPlaceholderText("Type to search...");

        fireEvent.focus(input);

        // ArrowDown to highlight first option
        fireEvent.keyDown(input, { key: "ArrowDown" });
        // ArrowDown to highlight second option
        fireEvent.keyDown(input, { key: "ArrowDown" });

        // Enter to select
        fireEvent.keyDown(input, { key: "Enter" });

        expect(mockOnSelect).toHaveBeenCalledWith("opt2");
    });

    it("should select exact match on Enter without highlight", () => {
        render(<SelectByTyping options={options} onSelect={mockOnSelect} />);
        const input = screen.getByPlaceholderText("Type to search...");

        fireEvent.change(input, { target: { value: "Banana" } });
        fireEvent.keyDown(input, { key: "Enter" });

        expect(mockOnSelect).toHaveBeenCalledWith("opt3");
    });

    it("should close options on Escape", () => {
        render(<SelectByTyping options={options} onSelect={mockOnSelect} />);
        const input = screen.getByPlaceholderText("Type to search...");

        fireEvent.focus(input);
        expect(screen.getByText("Option 1")).toBeInTheDocument();

        fireEvent.keyDown(input, { key: "Escape" });
        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });

    it("should handle excludeSelectedValues", () => {
        render(
            <SelectByTyping
                options={options}
                onSelect={mockOnSelect}
                selectedValues={["opt1"]}
                excludeSelectedValues
            />
        );
        const input = screen.getByPlaceholderText("Type to search...");

        fireEvent.focus(input);

        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
        expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("should prevent duplicate selection if allowDuplicate is false", () => {
        render(
            <SelectByTyping
                options={options}
                onSelect={mockOnSelect}
                selectedValues={["opt1"]}
                allowDuplicate={false}
            />
        );
        const input = screen.getByPlaceholderText("Type to search...");

        fireEvent.focus(input);
        fireEvent.click(screen.getByText("Option 1"));

        expect(mockOnSelect).not.toHaveBeenCalled();
    });

    it("should close options when clicking outside", () => {
        render(
            <div>
                <div data-testid="outside">Outside</div>
                <SelectByTyping options={options} onSelect={mockOnSelect} />
            </div>
        );
        const input = screen.getByPlaceholderText("Type to search...");

        fireEvent.focus(input);
        expect(screen.getByText("Option 1")).toBeInTheDocument();

        fireEvent.mouseDown(screen.getByTestId("outside"));
        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });
});
