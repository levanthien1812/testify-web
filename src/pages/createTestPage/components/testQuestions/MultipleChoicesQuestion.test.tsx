import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MulitpleChoiceQuestion from "./MultipleChoicesQuestion";
import { useForm } from "react-hook-form";
import { useAppSelector } from "../../../../hooks/hooks";
import { QUESTION_INSTRUCTIONS } from "../../../../config/constants/tests";
import {
    MultipleChoiceQuestionBodyItf,
    QuestionBodyItf,
} from "../../../../types/types";

// Mock dependencies
jest.mock("../../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

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
    return React.forwardRef(({ label, ...props }: any, ref: any) => (
        <label>
            {label?.text}
            <input ref={ref} {...props} />
        </label>
    ));
});

jest.mock("../../../../components/elements/Checkbox", () => {
    const React = require("react");
    return React.forwardRef(({ label, ...props }: any, ref: any) => (
        <label>
            <input type="checkbox" ref={ref} {...props} />
            {label?.text}
        </label>
    ));
});

const defaultContent = {
    text: "<p>Question text</p>",
    instruction_text: QUESTION_INSTRUCTIONS.MULTIPLE_CHOICES_SINGLE,
    allow_multiple: false,
    options: [{ text: "Option A" }, { text: "Option B" }],
};

const TestWrapper = ({ initialContent = defaultContent }) => {
    const {
        control,
        formState: { errors },
        setValue,
        watch,
    } = useForm<QuestionBodyItf<MultipleChoiceQuestionBodyItf>>({
        defaultValues: {
            content: initialContent,
        } as unknown as QuestionBodyItf<MultipleChoiceQuestionBodyItf>,
    });
    const content = watch("content");

    return (
        <MulitpleChoiceQuestion
            content={content}
            control={control}
            errors={errors}
            setValue={setValue}
        />
    );
};

describe("MulitpleChoiceQuestion", () => {
    const mockEditibility = {
        TEST_QUESTIONS: {
            content: true,
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            editibility: mockEditibility,
        });
    });

    it("should render all fields correctly", () => {
        render(<TestWrapper />);

        expect(screen.getByLabelText("Instruction text")).toHaveValue(
            QUESTION_INSTRUCTIONS.MULTIPLE_CHOICES_SINGLE
        );
        expect(screen.getByTestId("mock-text-editor")).toHaveValue(
            "<p>Question text</p>"
        );
        expect(
            screen.getByLabelText("Allow multiple selection")
        ).not.toBeChecked();
        expect(screen.getAllByTestId("mock-option")).toHaveLength(2);
        expect(screen.getByText("Add option")).toBeInTheDocument();
    });

    it("should add a new option when Add option button is clicked", async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const addButton = screen.getByText("Add option");
        await user.click(addButton);

        expect(screen.getAllByTestId("mock-option")).toHaveLength(3);
    });

    it("should remove an option when delete button is clicked", async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const deleteButtons = screen.getAllByText("Delete");
        await user.click(deleteButtons[0]);

        expect(screen.getAllByTestId("mock-option")).toHaveLength(1);
    });

    it("should update instruction text when allow_multiple changes", async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const checkbox = screen.getByLabelText("Allow multiple selection");
        const instructionInput = screen.getByLabelText("Instruction text");

        // Initially unchecked
        expect(checkbox).not.toBeChecked();
        expect(instructionInput).toHaveValue(
            QUESTION_INSTRUCTIONS.MULTIPLE_CHOICES_SINGLE
        );

        // Check
        await user.click(checkbox);
        expect(checkbox).toBeChecked();

        // The useEffect in the component updates the instruction text
        await waitFor(() => {
            expect(instructionInput).toHaveValue(
                QUESTION_INSTRUCTIONS.MULTIPLE_CHOICES_MULTIPLE
            );
        });

        // Uncheck
        await user.click(checkbox);
        expect(checkbox).not.toBeChecked();
        await waitFor(() => {
            expect(instructionInput).toHaveValue(
                QUESTION_INSTRUCTIONS.MULTIPLE_CHOICES_SINGLE
            );
        });
    });

    it("should disable inputs when editibility is false", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            editibility: {
                TEST_QUESTIONS: {
                    content: false,
                },
            },
        });

        render(<TestWrapper />);

        expect(
            screen.getByLabelText("Allow multiple selection")
        ).toBeDisabled();
        expect(screen.getByText("Add option")).toBeDisabled();

        // Note: Instruction text input does not have disabled prop in the component implementation
        // Note: TextEditor disabled state is handled by Controller but not passed to the mock
    });

    it("should disable add option button when max options reached", () => {
        const manyOptions = Array(10).fill({ text: "Option" });
        render(
            <TestWrapper
                initialContent={{ ...defaultContent, options: manyOptions }}
            />
        );

        expect(screen.getByText("Add option")).toBeDisabled();
    });
});
