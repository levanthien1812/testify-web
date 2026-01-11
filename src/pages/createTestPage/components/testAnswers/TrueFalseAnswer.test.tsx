import { render, screen, fireEvent } from "@testing-library/react";
import TrueFalseAnswer from "./TrueFalseAnswer";

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
    "../../../../components/elements/RadioList",
    () =>
        ({ name, options, selectedValue, onChange }: any) =>
            (
                <div data-testid="radio-list">
                    <div data-testid="radio-list-name">{name}</div>
                    <div data-testid="radio-list-selected">{selectedValue}</div>
                    {options.map((opt: any) => (
                        <button
                            key={opt.value}
                            onClick={() => onChange(opt.value)}
                            data-testid={`radio-${opt.value}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )
);

const mockContent = {
    id: "q1",
    type: "TRUE_FALSE",
    instruction_text: "Select true or false",
    text: "<p>Question text</p>",
    answer: {
        is_true: undefined,
    },
};

describe("TrueFalseAnswer", () => {
    it("should render correctly", () => {
        render(
            <TrueFalseAnswer
                content={mockContent as any}
                reset={false}
                onProvideAnswer={jest.fn()}
            />
        );

        expect(screen.getByTestId("instruction-text")).toHaveTextContent(
            "Select true or false"
        );
        expect(screen.getByTestId("html-display")).toHaveTextContent(
            "<p>Question text</p>"
        );
        expect(screen.getByTestId("radio-list-name")).toHaveTextContent(
            "q1_is_true"
        );
    });

    it("should handle True selection", () => {
        const onProvideAnswer = jest.fn();
        render(
            <TrueFalseAnswer
                content={mockContent as any}
                reset={false}
                onProvideAnswer={onProvideAnswer}
            />
        );

        fireEvent.click(screen.getByTestId("radio-true"));

        expect(onProvideAnswer).toHaveBeenCalledWith({
            ...mockContent.answer,
            is_true: true,
            is_saved: false,
        });
    });

    it("should handle False selection", () => {
        const onProvideAnswer = jest.fn();
        render(
            <TrueFalseAnswer
                content={mockContent as any}
                reset={false}
                onProvideAnswer={onProvideAnswer}
            />
        );

        fireEvent.click(screen.getByTestId("radio-false"));

        expect(onProvideAnswer).toHaveBeenCalledWith({
            ...mockContent.answer,
            is_true: false,
            is_saved: false,
        });
    });

    it("should display selected value from content", () => {
        const contentWithAnswer = {
            ...mockContent,
            answer: { is_true: true },
        };
        render(
            <TrueFalseAnswer
                content={contentWithAnswer as any}
                reset={false}
                onProvideAnswer={jest.fn()}
            />
        );

        expect(screen.getByTestId("radio-list-selected")).toHaveTextContent(
            "true"
        );
    });

    it("should display selected value false from content", () => {
        const contentWithAnswer = {
            ...mockContent,
            answer: { is_true: false },
        };
        render(
            <TrueFalseAnswer
                content={contentWithAnswer as any}
                reset={false}
                onProvideAnswer={jest.fn()}
            />
        );

        expect(screen.getByTestId("radio-list-selected")).toHaveTextContent(
            "false"
        );
    });
});
