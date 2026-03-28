import { render, screen, fireEvent } from "@testing-library/react";
import Checkbox from "./Checkbox";
import React from "react";

// Mock FontAwesomeIcon
jest.mock("@fortawesome/react-fontawesome", () => ({
    FontAwesomeIcon: ({ icon, className }: any) => (
        <span data-testid={`icon-${icon.iconName}`} className={className} />
    ),
}));

describe("Checkbox", () => {
    it("should render correctly", () => {
        render(<Checkbox name="test-checkbox" />);
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toHaveAttribute("type", "checkbox");
        expect(checkbox).not.toBeChecked();
    });

    it("should render label correctly", () => {
        render(
            <Checkbox label={{ text: "Test Label" }} name="test-checkbox" />
        );
        expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    });

    it("should handle checked state", () => {
        render(<Checkbox checked readOnly name="test-checkbox" />);
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeChecked();
    });

    it("should call onChange when clicked", () => {
        const handleChange = jest.fn();
        render(<Checkbox onChange={handleChange} name="test-checkbox" />);
        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("should display error message", () => {
        render(<Checkbox error="Error message" name="test-checkbox" />);
        expect(screen.getByText("Error message")).toBeInTheDocument();
        expect(screen.getByText("Error message")).toHaveClass(
            "text-orange-600"
        );
    });

    it("should display helper text", () => {
        render(<Checkbox helperText="Helper text" name="test-checkbox" />);
        expect(screen.getByText("Helper text")).toBeInTheDocument();
        expect(screen.getByText("Helper text")).toHaveClass("text-gray-500");
    });

    it("should handle sizing props", () => {
        const { rerender } = render(
            <Checkbox sizing="sm" name="test-checkbox" />
        );
        let checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveClass("w-3 h-3");

        rerender(<Checkbox sizing="md" name="test-checkbox" />);
        checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveClass("w-4 h-4");
    });

    it("should handle displayIcon mode (checked)", () => {
        render(<Checkbox displayIcon checked readOnly name="test-checkbox" />);
        // Input should be hidden
        expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
        // Check icon should be visible (faCheckCircle -> check-circle)
        const icon = screen.getByTestId("icon-check-circle");
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass("text-green-500");
    });

    it("should handle displayIcon mode (unchecked)", () => {
        render(
            <Checkbox
                displayIcon
                checked={false}
                readOnly
                name="test-checkbox"
            />
        );
        // Times icon should be visible (faTimesCircle -> times-circle)
        const icon = screen.getByTestId("icon-times-circle");
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass("text-red-500");
    });

    it("should forward ref", () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<Checkbox ref={ref} name="test-checkbox" />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("should show required asterisk", () => {
        render(
            <Checkbox
                required
                label={{ text: "Required Label" }}
                name="test-checkbox"
            />
        );
        expect(screen.getByText("*")).toBeInTheDocument();
        expect(screen.getByText("*")).toHaveClass("text-orange-600");
    });
});
