import { render, screen, fireEvent } from "@testing-library/react";
import MultipleChoicesAnswer from "./MultipleChoicesAnswer";

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

const mockContentSingle = {
    id: "q1",
    type: "MULTIPLE_CHOICES",
    instruction_text: "Select one",
    text: "<p>Question text</p>",
    options: [
        { id: "opt1", text: "Option 1" },
        { id: "opt2", text: "Option 2" },
    ],
    allow_multiple: false,
    answer: {
        options: [],
    },
};

const mockContentMultiple = {
    ...mockContentSingle,
    instruction_text: "Select multiple",
    allow_multiple: true,
};

describe("MultipleChoicesAnswer", () => {
    it("should render single choice question correctly", () => {
        render(
            <MultipleChoicesAnswer
                content={mockContentSingle as any}
                reset={false}
                onProvideAnswer={jest.fn()}
            />
        );

        expect(screen.getByTestId("instruction-text")).toHaveTextContent(
            "Select one"
        );
        expect(screen.getByTestId("html-display")).toHaveTextContent(
            "<p>Question text</p>"
        );
        expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
        expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
        expect(screen.getByLabelText("Option 1")).toHaveAttribute(
            "type",
            "radio"
        );
    });

    it("should render multiple choice question correctly", () => {
        render(
            <MultipleChoicesAnswer
                content={mockContentMultiple as any}
                reset={false}
                onProvideAnswer={jest.fn()}
            />
        );

        expect(screen.getByTestId("instruction-text")).toHaveTextContent(
            "Select multiple"
        );
        expect(screen.getByLabelText("Option 1")).toHaveAttribute(
            "type",
            "checkbox"
        );
    });

    it("should handle radio selection", () => {
        const onProvideAnswer = jest.fn();
        render(
            <MultipleChoicesAnswer
                content={mockContentSingle as any}
                reset={false}
                onProvideAnswer={onProvideAnswer}
            />
        );

        const option1 = screen.getByLabelText("Option 1");
        fireEvent.click(option1);

        expect(onProvideAnswer).toHaveBeenCalledWith({
            ...mockContentSingle.answer,
            options: ["opt1"],
        });
        expect(option1).toBeChecked();
    });

    it("should handle checkbox selection", () => {
        const onProvideAnswer = jest.fn();
        render(
            <MultipleChoicesAnswer
                content={mockContentMultiple as any}
                reset={false}
                onProvideAnswer={onProvideAnswer}
            />
        );

        const option1 = screen.getByLabelText("Option 1");
        const option2 = screen.getByLabelText("Option 2");

        fireEvent.click(option1);
        expect(onProvideAnswer).toHaveBeenCalledWith({
            ...mockContentMultiple.answer,
            options: ["opt1"],
        });
        expect(option1).toBeChecked();

        fireEvent.click(option2);
        expect(onProvideAnswer).toHaveBeenCalledWith({
            ...mockContentMultiple.answer,
            options: ["opt1", "opt2"],
        });
        expect(option2).toBeChecked();

        fireEvent.click(option1);
        expect(onProvideAnswer).toHaveBeenCalledWith({
            ...mockContentMultiple.answer,
            options: ["opt2"],
        });
        expect(option1).not.toBeChecked();
    });

    it("should initialize with existing answer", () => {
        const contentWithAnswer = {
            ...mockContentSingle,
            answer: { options: ["opt2"] },
        };
        render(
            <MultipleChoicesAnswer
                content={contentWithAnswer as any}
                reset={false}
                onProvideAnswer={jest.fn()}
            />
        );

        expect(screen.getByLabelText("Option 2")).toBeChecked();
    });

    it("should reset selection when reset prop changes to true", () => {
        const { rerender } = render(
            <MultipleChoicesAnswer
                content={mockContentSingle as any}
                reset={false}
                onProvideAnswer={jest.fn()}
            />
        );

        const option1 = screen.getByLabelText("Option 1");
        fireEvent.click(option1);
        expect(option1).toBeChecked();

        rerender(
            <MultipleChoicesAnswer
                content={mockContentSingle as any}
                reset={true}
                onProvideAnswer={jest.fn()}
            />
        );

        expect(option1).not.toBeChecked();
    });
});
