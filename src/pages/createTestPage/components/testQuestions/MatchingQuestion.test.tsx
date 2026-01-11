import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MatchingQuestion from "./MatchingQuestion";
import { useForm } from "react-hook-form";
import {
    QuestionBodyItf,
    MatchingQuestionBodyItf,
} from "../../../../types/types";

// Mock dependencies
jest.mock("../../../../components/richTextEditor/TiptapEditor", () => ({
    __esModule: true,
    default: ({ content, setContent }: any) => (
        <textarea
            data-testid="mock-text-editor"
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />
    ),
}));

jest.mock("./Option", () => {
    const React = require("react");
    return {
        __esModule: true,
        default: React.forwardRef(
            ({ index, onDelete, defaultValue, ...props }: any, ref: any) => (
                <div data-testid="mock-option" ref={ref}>
                    <input
                        data-testid={`option-input-${index}`}
                        defaultValue={defaultValue}
                        {...props}
                    />
                    <button type="button" onClick={() => onDelete(index)}>
                        Delete
                    </button>
                </div>
            )
        ),
    };
});

// Mock UI components
jest.mock("../../../../components/elements/Input", () => {
    const React = require("react");
    return {
        __esModule: true,
        default: React.forwardRef(({ label, ...props }: any, ref: any) => (
            <label>
                {label?.text}
                <input ref={ref} {...props} />
            </label>
        )),
    };
});

jest.mock("../../../../components/elements/Button", () => ({
    __esModule: true,
    default: ({ children, secondary, ...props }: any) => (
        <button {...props}>{children}</button>
    ),
}));

const defaultContent: MatchingQuestionBodyItf = {
    text: "<p>Match the following</p>",
    instruction_text: "Match items from left to right",
    left_items: [{ text: "Left 1" }, { text: "Left 2" }],
    right_items: [{ text: "Right 1" }, { text: "Right 2" }],
};

const TestWrapper = ({ initialContent = defaultContent }) => {
    const {
        control,
        formState: { errors },
        watch,
    } = useForm<QuestionBodyItf<MatchingQuestionBodyItf>>({
        defaultValues: {
            content: initialContent,
        } as unknown as QuestionBodyItf<MatchingQuestionBodyItf>,
    });
    const content = watch("content");

    return (
        <MatchingQuestion content={content} control={control} errors={errors} />
    );
};

describe("MatchingQuestion", () => {
    it("should render all fields correctly", () => {
        render(<TestWrapper />);

        expect(screen.getByLabelText("Instruction text")).toHaveValue(
            "Match items from left to right"
        );
        expect(screen.getByTestId("mock-text-editor")).toHaveValue(
            "<p>Match the following</p>"
        );

        const leftPart = screen.getByTestId("left-part");
        const rightPart = screen.getByTestId("right-part");

        expect(within(leftPart).getAllByTestId("mock-option")).toHaveLength(2);
        expect(within(rightPart).getAllByTestId("mock-option")).toHaveLength(2);

        expect(screen.getByText("Add item")).toBeInTheDocument();
    });

    it("should add a new item pair when Add item button is clicked", async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const addButton = screen.getByText("Add item");
        await user.click(addButton);

        const leftPart = screen.getByTestId("left-part");
        const rightPart = screen.getByTestId("right-part");

        expect(within(leftPart).getAllByTestId("mock-option")).toHaveLength(3);
        expect(within(rightPart).getAllByTestId("mock-option")).toHaveLength(3);
    });

    it("should remove an item from left list when delete button is clicked", async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const leftPart = screen.getByTestId("left-part");
        const deleteButtons = within(leftPart).getAllByText("Delete");
        await user.click(deleteButtons[0]);

        expect(within(leftPart).getAllByTestId("mock-option")).toHaveLength(1);

        const rightPart = screen.getByTestId("right-part");
        expect(within(rightPart).getAllByTestId("mock-option")).toHaveLength(2);
    });

    it("should remove an item from right list when delete button is clicked", async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const rightPart = screen.getByTestId("right-part");
        const deleteButtons = within(rightPart).getAllByText("Delete");
        await user.click(deleteButtons[0]);

        expect(within(rightPart).getAllByTestId("mock-option")).toHaveLength(1);

        const leftPart = screen.getByTestId("left-part");
        expect(within(leftPart).getAllByTestId("mock-option")).toHaveLength(2);
    });

    it("should disable add item button when max items reached", () => {
        const manyItems = Array(10).fill({ text: "Item" });
        const contentWithMaxItems = {
            ...defaultContent,
            left_items: manyItems,
            right_items: manyItems,
        };

        render(<TestWrapper initialContent={contentWithMaxItems} />);

        expect(screen.getByText("Add item")).toBeDisabled();
    });
});
