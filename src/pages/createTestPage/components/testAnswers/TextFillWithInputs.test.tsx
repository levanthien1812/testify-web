import { render, screen, fireEvent } from "@testing-library/react";
import TextFillWithInputs from "./TextFillWithInputs";
import { FILL_GAP_METHOD } from "../../../../config/constants/tests";
import { TipTapDoc } from "../../../../types/types";

// Mock InfoMessage
jest.mock(
    "../../../../components/elements/InfoMessage",
    () =>
        ({ message }: any) =>
            <div data-testid="info-message">{message}</div>
);

const mockDoc: TipTapDoc = {
    type: "doc",
    content: [
        {
            type: "paragraph",
            content: [
                { type: "text", text: "Hello " },
                { type: "inputPlaceholder", text: "", attrs: { id: "gap-1" } },
                { type: "text", text: " world" },
            ],
        },
    ],
};

const mockWords = [{ text: "beautiful" }, { text: "ugly" }];

describe("TextFillWithInputs", () => {
    it("should render text and inputs correctly", () => {
        render(
            <TextFillWithInputs doc={mockDoc} method={FILL_GAP_METHOD.INPUT} />
        );

        expect(screen.getByText(/Hello/i)).toBeInTheDocument();
        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.getByText(/world/i)).toBeInTheDocument();
    });

    it("should handle typing in input when method is INPUT", () => {
        const onAnswersChange = jest.fn();
        render(
            <TextFillWithInputs
                doc={mockDoc}
                method={FILL_GAP_METHOD.INPUT}
                onAnswersChange={onAnswersChange}
            />
        );

        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "test" } });

        expect(onAnswersChange).toHaveBeenCalledWith({
            "gap-1": { value: "test" },
        });
        expect(input).toHaveValue("test");
    });

    it("should render draggable words when method is DRAG_DROP", () => {
        render(
            <TextFillWithInputs
                doc={mockDoc}
                method={FILL_GAP_METHOD.DRAG_DROP}
                words={mockWords}
            />
        );

        expect(screen.getByText("beautiful")).toBeInTheDocument();
        expect(screen.getByText("ugly")).toBeInTheDocument();
        expect(screen.getByTestId("info-message")).toBeInTheDocument();

        // Inputs should be readOnly in DRAG_DROP mode
        const input = screen.getByRole("textbox");
        expect(input).toHaveAttribute("readonly");
    });

    it("should handle drag and drop interaction", () => {
        const onAnswersChange = jest.fn();
        render(
            <TextFillWithInputs
                doc={mockDoc}
                method={FILL_GAP_METHOD.DRAG_DROP}
                words={mockWords}
                onAnswersChange={onAnswersChange}
            />
        );

        const word = screen.getByText("beautiful");
        const input = screen.getByRole("textbox");

        // Simulate drag start to set internal state `draggingWord`
        fireEvent.dragStart(word);

        // Simulate drop on input
        fireEvent.drop(input);

        expect(onAnswersChange).toHaveBeenCalledWith({
            "gap-1": { value: "beautiful" },
        });

        // The component updates local state, so the input value should update
        expect(input).toHaveValue("beautiful");

        // The word should be removed from the list of available words
        expect(screen.queryByText("beautiful")).not.toBeInTheDocument();
    });

    it("should clear answer on double click", () => {
        const onAnswersChange = jest.fn();
        const givenAnswers = { "gap-1": { value: "beautiful" } };

        render(
            <TextFillWithInputs
                doc={mockDoc}
                method={FILL_GAP_METHOD.DRAG_DROP}
                words={mockWords}
                givenAnswers={givenAnswers}
                onAnswersChange={onAnswersChange}
            />
        );

        const input = screen.getByRole("textbox");
        expect(input).toHaveValue("beautiful");

        // Word should not be in the list initially because it is used
        expect(screen.queryByText("beautiful")).not.toBeInTheDocument();

        fireEvent.doubleClick(input);

        expect(onAnswersChange).toHaveBeenCalledWith({
            "gap-1": { value: "" },
        });
        expect(input).toHaveValue("");

        // Word should reappear in the list
        expect(screen.getByText("beautiful")).toBeInTheDocument();
    });

    it("should apply correct styles for answer status", () => {
        const givenAnswers = {
            "gap-1": { value: "test", status: "correct" as const },
        };

        render(
            <TextFillWithInputs
                doc={mockDoc}
                method={FILL_GAP_METHOD.INPUT}
                givenAnswers={givenAnswers}
            />
        );

        const input = screen.getByRole("textbox");
        expect(input).toHaveClass("bg-green-50");
        expect(input).toHaveClass("border-green-500");
    });

    it("should apply wrong styles for wrong answer status", () => {
        const givenAnswers = {
            "gap-1": { value: "test", status: "wrong" as const },
        };

        render(
            <TextFillWithInputs
                doc={mockDoc}
                method={FILL_GAP_METHOD.INPUT}
                givenAnswers={givenAnswers}
            />
        );

        const input = screen.getByRole("textbox");
        expect(input).toHaveClass("bg-red-50");
        expect(input).toHaveClass("border-red-500");
    });

    it("should handle readonly mode", () => {
        const onAnswersChange = jest.fn();
        render(
            <TextFillWithInputs
                doc={mockDoc}
                method={FILL_GAP_METHOD.INPUT}
                readonly={true}
                onAnswersChange={onAnswersChange}
            />
        );

        const input = screen.getByRole("textbox");
        expect(input.getAttribute("class")).toContain("pointer-events-none");
        expect(input).toHaveAttribute("readonly");

        // Double click should not trigger change
        fireEvent.doubleClick(input);
        expect(onAnswersChange).not.toHaveBeenCalled();
    });

    it("should render draggable words as non-draggable in readonly mode", () => {
        render(
            <TextFillWithInputs
                doc={mockDoc}
                method={FILL_GAP_METHOD.DRAG_DROP}
                words={mockWords}
                readonly={true}
            />
        );

        const word = screen.getByText("beautiful");
        expect(word).toHaveAttribute("draggable", "false");
        expect(word).toHaveClass("cursor-default");
        expect(screen.queryByTestId("info-message")).not.toBeInTheDocument();
    });
});
