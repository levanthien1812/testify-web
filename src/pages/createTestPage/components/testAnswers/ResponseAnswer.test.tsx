import { render, screen } from "@testing-library/react";
import ResponseAnswer from "./ResponseAnswer";

// Mock dependencies
jest.mock(
    "../../../../components/elements/HtmlDisplay",
    () =>
        ({ htmlContent }: any) =>
            <div data-testid="html-display">{htmlContent}</div>
);

jest.mock("./InstructionText", () => ({ text }: any) => (
    <div data-testid="instruction-text">{text}</div>
));

jest.mock(
    "../../../../components/elements/InfoMessage",
    () =>
        ({ message }: any) =>
            <div data-testid="info-message">{message}</div>
);

const mockContent = {
    id: "q1",
    type: "RESPONSE",
    instruction_text: "Write your response",
    text: "<p>Question content</p>",
};

describe("ResponseAnswer", () => {
    it("should render correctly", () => {
        render(<ResponseAnswer content={mockContent as any} />);

        expect(screen.getByTestId("instruction-text")).toHaveTextContent(
            "Write your response"
        );
        expect(screen.getByTestId("html-display")).toHaveTextContent(
            "<p>Question content</p>"
        );
        expect(screen.getByTestId("info-message")).toHaveTextContent(
            "You need to manually score student's answers for this question"
        );
    });
});
