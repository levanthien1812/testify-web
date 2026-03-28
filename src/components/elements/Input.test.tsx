import { render, screen } from "@testing-library/react";
import Input from "./Input";
import React from "react";

describe("Input", () => {
    it("should render correctly", () => {
        render(<Input name="test-input" />);
        expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("should render label", () => {
        render(<Input name="test-input" label={{ text: "Test Label" }} />);
        expect(screen.getByLabelText("Test Label:")).toBeInTheDocument();
    });

    it("should show required asterisk", () => {
        render(<Input name="test-input" label={{ text: "Label" }} required />);
        expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("should render error message", () => {
        render(<Input name="test-input" error="Error occurred" />);
        expect(screen.getByText("Error occurred")).toBeInTheDocument();
        expect(screen.getByRole("textbox")).toHaveClass("border-orange-600");
    });

    it("should render helper text", () => {
        render(<Input name="test-input" helperText="Help me" />);
        expect(screen.getByText("Help me")).toBeInTheDocument();
    });

    it("should handle sizing", () => {
        const { rerender } = render(<Input name="test-input" sizing="sm" />);
        expect(screen.getByRole("textbox")).toHaveClass("px-1 py-0 text-sm");

        rerender(<Input name="test-input" sizing="md" />);
        expect(screen.getByRole("textbox")).toHaveClass("px-2 py-1 text-md");
    });

    it("should forward ref", () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<Input name="test-input" ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("should handle file type", () => {
        const { container } = render(<Input name="test-input" type="file" />);
        // getByRole("textbox") doesn't work for type="file"
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const input = container.querySelector('input[type="file"]');
        expect(input).toBeInTheDocument();
        expect(input).toHaveClass("file:bg-orange-600");
    });

    it("should apply custom className", () => {
        render(<Input name="test-input" className="custom-class" />);
        expect(screen.getByRole("textbox")).toHaveClass("custom-class");
    });
});
