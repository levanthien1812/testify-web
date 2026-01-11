import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FillGapsQuestion from "./FillGapsQuestion";
import { useForm } from "react-hook-form";
import {
    QuestionBodyItf,
    FillGapsQuestionBodyItf,
} from "../../../../types/types";
import {
    FILL_GAP_INDICATOR,
    FILL_GAP_METHOD,
} from "../../../../config/constants/tests";

// Mock dependencies
jest.mock("../../../../components/richTextEditor/TiptapEditor", () => ({
    __esModule: true,
    default: ({ content, setContent, setJson }: any) => (
        <textarea
            data-testid="mock-text-editor"
            value={content}
            onChange={(e) => {
                setContent(e.target.value);
                setJson(JSON.stringify({ type: "doc", content: [] }));
            }}
        />
    ),
}));

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

jest.mock("../../../../components/elements/Select", () => {
    const React = require("react");
    return React.forwardRef(({ label, options, ...props }: any, ref: any) => (
        <label>
            {label?.text}
            <select ref={ref} {...props}>
                {options.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </label>
    ));
});

const defaultContent: FillGapsQuestionBodyItf = {
    text: "<p>Question text with {{gap}}</p>",
    instruction_text: "Fill in the gaps",
    num_gaps: 1,
    fill_method: FILL_GAP_METHOD.INPUT,
    given_words: [],
    json_text: "{}",
};

const TestWrapper = ({ initialContent = defaultContent }) => {
    const {
        control,
        formState: { errors },
        setValue,
        watch,
        trigger,
    } = useForm<QuestionBodyItf<FillGapsQuestionBodyItf>>({
        defaultValues: {
            content: initialContent,
        } as unknown as QuestionBodyItf<FillGapsQuestionBodyItf>,
        mode: "onChange",
    });
    const content = watch("content");

    return (
        <>
            <FillGapsQuestion
                content={content}
                control={control}
                errors={errors}
                setValue={setValue}
            />
            <button onClick={() => trigger()}>Trigger Validation</button>
        </>
    );
};

describe("FillGapsQuestion", () => {
    it("should render all fields correctly", () => {
        render(<TestWrapper />);

        expect(screen.getByLabelText("Instruction text")).toHaveValue(
            "Fill in the gaps"
        );
        expect(screen.getByLabelText("Number of gaps")).toHaveValue(1);
        expect(screen.getByTestId("mock-text-editor")).toHaveValue(
            "<p>Question text with {{gap}}</p>"
        );
        expect(screen.getByLabelText("Fill method")).toHaveValue(
            FILL_GAP_METHOD.INPUT
        );
    });

    it("should show given words input when fill method is DRAG_DROP", async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const select = screen.getByLabelText("Fill method");
        await user.selectOptions(select, FILL_GAP_METHOD.DRAG_DROP);

        expect(
            screen.getByLabelText("Provide words to fill in:")
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter word")).toBeInTheDocument();
    });

    it("should add a word when Enter is pressed", async () => {
        const user = userEvent.setup();
        const contentWithDragDrop = {
            ...defaultContent,
            fill_method: FILL_GAP_METHOD.DRAG_DROP,
        };
        render(<TestWrapper initialContent={contentWithDragDrop} />);

        const input = screen.getByPlaceholderText("Enter word");
        await user.type(input, "Word1{enter}");

        expect(screen.getByText("Word1")).toBeInTheDocument();
        expect(input).toHaveValue("");
    });

    it("should add a word on blur", async () => {
        const user = userEvent.setup();
        const contentWithDragDrop = {
            ...defaultContent,
            fill_method: FILL_GAP_METHOD.DRAG_DROP,
        };
        render(<TestWrapper initialContent={contentWithDragDrop} />);

        const input = screen.getByPlaceholderText("Enter word");
        await user.type(input, "Word2");
        fireEvent.blur(input);

        expect(screen.getByText("Word2")).toBeInTheDocument();
        expect(input).toHaveValue("");
    });

    it("should remove a word when clicked", async () => {
        const user = userEvent.setup();
        const contentWithWords = {
            ...defaultContent,
            fill_method: FILL_GAP_METHOD.DRAG_DROP,
            given_words: [{ text: "Word1" }, { text: "Word2" }],
        };
        render(<TestWrapper initialContent={contentWithWords} />);

        expect(screen.getByText("Word1")).toBeInTheDocument();
        expect(screen.getByText("Word2")).toBeInTheDocument();

        await user.click(screen.getByText("Word1"));

        expect(screen.queryByText("Word1")).not.toBeInTheDocument();
        expect(screen.getByText("Word2")).toBeInTheDocument();
    });

    it("should not add empty word", async () => {
        const user = userEvent.setup();
        const contentWithDragDrop = {
            ...defaultContent,
            fill_method: FILL_GAP_METHOD.DRAG_DROP,
        };
        render(<TestWrapper initialContent={contentWithDragDrop} />);

        const input = screen.getByPlaceholderText("Enter word");
        await user.type(input, "{enter}");
        fireEvent.blur(input);

        // Check if any button (word) is added. Initially there are 0.
        await waitFor(() => {
            const wordButtons = screen.queryAllByRole("button", { name: "" });
            expect(wordButtons).toHaveLength(0);
        });
    });

    it("should display validation error when text does not contain gaps", async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const textEditor = screen.getByTestId("mock-text-editor");
        fireEvent.change(textEditor, {
            target: { value: "Text without gaps" },
        });

        const triggerBtn = screen.getByText("Trigger Validation");
        await user.click(triggerBtn);

        expect(
            await screen.findByText("Text must contain at least one gap")
        ).toBeInTheDocument();
    });

    it("should display validation error when number of gaps does not match text gaps", async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);

        const textEditor = screen.getByTestId("mock-text-editor");
        fireEvent.change(textEditor, {
            target: {
                value: `Gap 1 ${FILL_GAP_INDICATOR} Gap 2 ${FILL_GAP_INDICATOR}`,
            },
        });

        const triggerBtn = screen.getByText("Trigger Validation");
        await user.click(triggerBtn);

        expect(
            await screen.findByText("Text must contain 1 gaps")
        ).toBeInTheDocument();
    });

    it("should display validation error when given words are insufficient for DRAG_DROP", async () => {
        const user = userEvent.setup();
        const content = {
            ...defaultContent,
            fill_method: FILL_GAP_METHOD.DRAG_DROP,
            num_gaps: 2,
            given_words: [{ text: "Word1" }],
            text: `Gap 1 ${FILL_GAP_INDICATOR} Gap 2 ${FILL_GAP_INDICATOR}`,
        };
        render(<TestWrapper initialContent={content} />);

        const triggerBtn = screen.getByText("Trigger Validation");
        await user.click(triggerBtn);

        expect(
            await screen.findByText(
                "Number of words must be greater than or equal to number of gaps"
            )
        ).toBeInTheDocument();
    });
});
