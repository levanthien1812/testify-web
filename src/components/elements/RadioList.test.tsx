import { render, screen, fireEvent } from "@testing-library/react";
import RadioList from "./RadioList";
import React from "react";

describe("RadioList", () => {
    const options = [
        { value: "opt1", label: "Option 1" },
        { value: "opt2", label: "Option 2" },
    ];
    const mockOnChange = jest.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it("should render options correctly", () => {
        render(
            <RadioList
                name="test-radio"
                options={options}
                selectedValue={null}
                onChange={mockOnChange}
            />
        );

        options.forEach((option) => {
            const radio = screen.getByLabelText(option.label);
            expect(radio).toBeInTheDocument();
            expect(radio).toHaveAttribute("value", option.value);
            expect(radio).toHaveAttribute("name", "test-radio");
            expect(radio).not.toBeChecked();
        });
    });

    it("should show selected value", () => {
        render(
            <RadioList
                name="test-radio"
                options={options}
                selectedValue="opt1"
                onChange={mockOnChange}
            />
        );

        expect(screen.getByLabelText("Option 1")).toBeChecked();
        expect(screen.getByLabelText("Option 2")).not.toBeChecked();
    });

    it("should handle numeric values", () => {
        const numOptions = [
            { value: 1, label: "One" },
            { value: 2, label: "Two" },
        ];
        render(
            <RadioList
                name="num-radio"
                options={numOptions}
                selectedValue={2}
                onChange={mockOnChange}
            />
        );

        expect(screen.getByLabelText("Two")).toBeChecked();

        fireEvent.click(screen.getByLabelText("One"));
        expect(mockOnChange).toHaveBeenCalledWith(1);
    });

    it("should call onChange when clicked", () => {
        render(
            <RadioList
                name="test-radio"
                options={options}
                selectedValue={null}
                onChange={mockOnChange}
            />
        );

        fireEvent.click(screen.getByLabelText("Option 2"));
        expect(mockOnChange).toHaveBeenCalledWith("opt2");
    });

    it("should display error message", () => {
        render(
            <RadioList
                name="test-radio"
                options={options}
                selectedValue={null}
                onChange={mockOnChange}
                error="Error occurred"
            />
        );

        expect(screen.getByText("Error occurred")).toBeInTheDocument();
        expect(screen.getByText("Error occurred")).toHaveClass(
            "text-orange-600"
        );
    });

    it("should display helper text", () => {
        render(
            <RadioList
                name="test-radio"
                options={options}
                selectedValue={null}
                onChange={mockOnChange}
                helperText="Help text"
            />
        );

        expect(screen.getByText("Help text")).toBeInTheDocument();
        expect(screen.getByText("Help text")).toHaveClass("text-gray-500");
    });

    it("should apply custom className", () => {
        const { container } = render(
            <RadioList
                name="test-radio"
                options={options}
                selectedValue={null}
                onChange={mockOnChange}
                className="custom-class"
            />
        );

        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const flexContainer = container.querySelector(".flex.gap-4");
        expect(flexContainer).toHaveClass("custom-class");
    });
});
