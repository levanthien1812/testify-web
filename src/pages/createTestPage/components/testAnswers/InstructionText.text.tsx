import { render, screen } from "@testing-library/react";
import InstructionText from "./InstructionText";

describe("InstructionText", () => {
    it("should render text correctly", () => {
        const text = "Sample instruction";
        render(<InstructionText text={text} />);
        const element = screen.getByText(text);
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass("text-gray-600 italic");
    });

    it("should render nothing if text is undefined", () => {
        const { container } = render(<InstructionText text={undefined} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("should render nothing if text is empty string", () => {
        const { container } = render(<InstructionText text="" />);
        expect(container).toBeEmptyDOMElement();
    });
});
