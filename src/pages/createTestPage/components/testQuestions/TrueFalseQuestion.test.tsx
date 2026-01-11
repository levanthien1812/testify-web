import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TrueFalseQuestion from "./TrueFalseQuestion";
import { useForm } from "react-hook-form";
import {
    QuestionBodyItf,
    TrueFalseQuestionBodyItf,
} from "../../../../types/types";
import { useAppSelector } from "../../../../hooks/hooks";

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

// Mock UI components
jest.mock("../../../../components/elements/Input", () => {
    const React = require("react");
    return {
        __esModule: true,
        default: React.forwardRef(
            ({ label, error, ...props }: any, ref: any) => (
                <div>
                    <label>
                        {label?.text}
                        <input ref={ref} {...props} />
                    </label>
                    {error && <span data-testid="input-error">{error}</span>}
                </div>
            )
        ),
    };
});

const defaultContent: TrueFalseQuestionBodyItf = {
    text: "<p>True or False?</p>",
    instruction_text: "Select true or false",
};

const TestWrapper = ({ initialContent = defaultContent }) => {
    const {
        control,
        formState: { errors },
        watch,
        trigger,
    } = useForm<QuestionBodyItf<TrueFalseQuestionBodyItf>>({
        defaultValues: {
            content: initialContent,
        } as unknown as QuestionBodyItf<TrueFalseQuestionBodyItf>,
        mode: "onChange",
    });
    const content = watch("content");

    return (
        <>
            <TrueFalseQuestion
                content={content}
                control={control}
                errors={errors}
            />
            <button onClick={() => trigger()}>Trigger Validation</button>
        </>
    );
};

describe("TrueFalseQuestion", () => {
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
            "Select true or false"
        );
        expect(screen.getByTestId("mock-text-editor")).toHaveValue(
            "<p>True or False?</p>"
        );
    });

    it("should update instruction text when changed", async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const instructionInput = screen.getByLabelText("Instruction text");
        await user.clear(instructionInput);
        await user.type(instructionInput, "New instruction");

        expect(instructionInput).toHaveValue("New instruction");
    });

    it("should display validation error when text is empty", async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const textEditor = screen.getByTestId("mock-text-editor");
        fireEvent.change(textEditor, { target: { value: "" } });

        const triggerBtn = screen.getByText("Trigger Validation");
        await user.click(triggerBtn);

        expect(await screen.findByText("Text is required")).toBeInTheDocument();
    });
});
