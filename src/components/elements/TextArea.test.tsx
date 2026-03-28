import { render, screen } from "@testing-library/react";
import TextArea from "./TextArea";
import React from "react";

describe("TextArea", () => {
    it("should render correctly", () => {
        render(<TextArea name="test-textarea" />);
        expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("should render label", () => {
        render(
            <TextArea name="test-textarea" label={{ text: "Test Label" }} />
        );
        expect(screen.getByLabelText("Test Label:")).toBeInTheDocument();
    });

    it("should show required asterisk", () => {
        render(
            <TextArea name="test-textarea" label={{ text: "Label" }} required />
        );
        expect(screen.getByText("*")).toBeInTheDocument();
        expect(screen.getByText("*")).toHaveClass("text-orange-600");
    });

    it("should render error message", () => {
        render(<TextArea name="test-textarea" error="Error occurred" />);
        expect(screen.getByText("Error occurred")).toBeInTheDocument();
        expect(screen.getByRole("textbox")).toHaveClass("border-orange-600");
    });

    it("should render helper text", () => {
        render(<TextArea name="test-textarea" helperText="Help me" />);
        expect(screen.getByText("Help me")).toBeInTheDocument();
        expect(screen.getByText("Help me")).toHaveClass("text-gray-500");
    });

    it("should handle sizing", () => {
        const { rerender } = render(
            <TextArea name="test-textarea" sizing="sm" />
        );
        expect(screen.getByRole("textbox")).toHaveClass("px-1 py-0 text-sm");

        rerender(<TextArea name="test-textarea" sizing="md" />);
        expect(screen.getByRole("textbox")).toHaveClass("px-2 py-1 text-md");
    });

    it("should forward ref", () => {
        const ref = React.createRef<HTMLTextAreaElement>();
        render(<TextArea name="test-textarea" ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });

    it("should apply custom className", () => {
        render(<TextArea name="test-textarea" className="custom-class" />);
        expect(screen.getByRole("textbox")).toHaveClass("custom-class");
    });

    it("should handle disabled state", () => {
        render(<TextArea name="test-textarea" disabled />);
        expect(screen.getByRole("textbox")).toBeDisabled();
    });
});
