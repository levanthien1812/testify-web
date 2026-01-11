import { render, screen, fireEvent } from "@testing-library/react";
import FillGapsAnswer from "./FillGapsAnswer";
import { FILL_GAP_METHOD } from "../../../../config/constants/tests";

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
    "./TextFillWithInputs",
    () =>
        ({ doc, method, words, onAnswersChange, givenAnswers }: any) =>
            (
                <div data-testid="text-fill-with-inputs">
                    <span data-testid="tf-method">{method}</span>
                    <button
                        data-testid="change-answer-btn"
                        onClick={() =>
                            onAnswersChange({
                                "gap-1": { value: "answer1" },
                                "gap-2": { value: "answer2" },
                            })
                        }
                    >
                        Change Answer
                    </button>
                    <div data-testid="given-answers">
                        {JSON.stringify(givenAnswers)}
                    </div>
                </div>
            )
);

const mockContent = {
    id: "q1",
    type: "FILL_IN_THE_GAPS",
    instruction_text: "Fill the gaps",
    text: "<p>Hello {{gap}} world {{gap}}</p>",
    json_text: '{"type":"doc","content":[]}',
    num_gaps: 2,
    fill_method: FILL_GAP_METHOD.INPUT,
    given_words: [],
    answer: {
        gaps: [
            { id: "gap-1", text: "initial1" },
            { id: "gap-2", text: "initial2" },
        ],
    },
};

describe("FillGapsAnswer", () => {
    it("should render instruction text and html display", () => {
        render(
            <FillGapsAnswer
                content={mockContent as any}
                reset={false}
                onProvideAnswer={jest.fn()}
            />
        );

        expect(screen.getByTestId("instruction-text")).toHaveTextContent(
            "Fill the gaps"
        );
        expect(screen.getByTestId("html-display")).toHaveTextContent(
            "<p>Hello {{gap}} world {{gap}}</p>"
        );
    });

    it("should pass correct props to TextFillWithInputs", () => {
        render(
            <FillGapsAnswer
                content={mockContent as any}
                reset={false}
                onProvideAnswer={jest.fn()}
            />
        );

        expect(screen.getByTestId("tf-method")).toHaveTextContent(
            FILL_GAP_METHOD.INPUT
        );
        const givenAnswersEl = screen.getByTestId("given-answers");
        const givenAnswers = JSON.parse(givenAnswersEl.textContent!);
        expect(givenAnswers).toEqual({
            "gap-1": { value: "initial1" },
            "gap-2": { value: "initial2" },
        });
    });

    it("should call onProvideAnswer when answers change", () => {
        const onProvideAnswer = jest.fn();
        render(
            <FillGapsAnswer
                content={mockContent as any}
                reset={false}
                onProvideAnswer={onProvideAnswer}
            />
        );

        const changeButton = screen.getByTestId("change-answer-btn");
        fireEvent.click(changeButton);

        expect(onProvideAnswer).toHaveBeenCalledWith({
            gaps: [
                { id: "gap-1", text: "answer1" },
                { id: "gap-2", text: "answer2" },
            ],
        });
    });

    it("should handle empty answer in content", () => {
        const contentNoAnswer = { ...mockContent, answer: undefined };
        render(
            <FillGapsAnswer
                content={contentNoAnswer as any}
                reset={false}
                onProvideAnswer={jest.fn()}
            />
        );

        const givenAnswersEl = screen.getByTestId("given-answers");
        expect(givenAnswersEl).toBeEmptyDOMElement();
    });
});
