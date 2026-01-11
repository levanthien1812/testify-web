import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResponseQuestion from "./ResponseQuestion";
import { useForm } from "react-hook-form";
import {
    QuestionBodyItf,
    ResponseQuestionBodyItf,
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

const defaultContent: ResponseQuestionBodyItf = {
    text: "<p>Write an essay about...</p>",
    instruction_text: "Write at least 100 words",
    min_length: 100,
    max_length: 500,
};

const TestWrapper = ({ initialContent = defaultContent }) => {
    const {
        control,
        formState: { errors },
        watch,
        trigger,
    } = useForm<QuestionBodyItf<ResponseQuestionBodyItf>>({
        defaultValues: {
            content: initialContent,
        } as unknown as QuestionBodyItf<ResponseQuestionBodyItf>,
        mode: "onChange",
    });
    const content = watch("content");

    return (
        <>
            <ResponseQuestion
                content={content}
                control={control}
                errors={errors}
            />
            <button onClick={() => trigger()}>Trigger Validation</button>
        </>
    );
};

describe("ResponseQuestion", () => {
    it("should render all fields correctly", () => {
        render(<TestWrapper />);

        expect(screen.getByLabelText("Instruction text")).toHaveValue(
            "Write at least 100 words"
        );
        expect(screen.getByTestId("mock-text-editor")).toHaveValue(
            "<p>Write an essay about...</p>"
        );
        expect(screen.getByLabelText("Minimum length of response")).toHaveValue(
            100
        );
        expect(screen.getByLabelText("Maximum length of response")).toHaveValue(
            500
        );
    });

    it("should display validation error when min length is empty", async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const minInput = screen.getByLabelText("Minimum length of response");
        await user.clear(minInput);
        fireEvent.blur(minInput);

        expect(
            await screen.findByText("Minimum length is required")
        ).toBeInTheDocument();
    });

    it("should display validation error when max length is empty", async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const maxInput = screen.getByLabelText("Maximum length of response");
        await user.clear(maxInput);
        fireEvent.blur(maxInput);

        expect(
            await screen.findByText("Maximum length is required")
        ).toBeInTheDocument();
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
