import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Answer from "./Answer";
import { QUESTION_TYPE } from "../../../../config/constants/tests";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { useChatSocket } from "../../../chatPage/components/ChatSocketContext";
import { useAppSelector } from "../../../../hooks/hooks";
import { createTestActions } from "../../../../stores/createTest";

jest.mock("../../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("../../../chatPage/components/ChatSocketContext", () => ({
    useChatSocket: jest.fn(),
}));

jest.mock("../../../../services/test", () => ({
    addAnswer: jest.fn(),
}));

jest.mock("../../../../stores/createTest", () => ({
    createTestActions: {
        saveTestQuestions: jest.fn((payload) => ({
            type: "SAVE_TEST_QUESTIONS",
            payload,
        })),
    },
}));

jest.mock("../../../../utils/primitives", () => ({
    getRound: (val: number) => val,
}));

jest.mock("../../../../utils/test", () => ({
    getTextToAskAI: jest.fn(() => "AI Prompt"),
}));

// Mock Child Components
jest.mock("./MultipleChoicesAnswer", () => ({ onProvideAnswer }: any) => (
    <div data-testid="multiple-choices-answer">
        <button onClick={() => onProvideAnswer({ options: ["opt1"] })}>
            Answer MC
        </button>
    </div>
));

jest.mock("./FillGapsAnswer", () => ({ onProvideAnswer }: any) => (
    <div data-testid="fill-gaps-answer">
        <button onClick={() => onProvideAnswer({ gaps: [] })}>Answer FG</button>
    </div>
));

jest.mock("./MatchingAnswer", () => ({ onProvideAnswer }: any) => (
    <div data-testid="matching-answer">
        <button onClick={() => onProvideAnswer({ matchings: [] })}>
            Answer MA
        </button>
    </div>
));

jest.mock("./ResponseAnswer", () => () => (
    <div data-testid="response-answer">Response Answer</div>
));

jest.mock("./TrueFalseAnswer", () => ({ onProvideAnswer }: any) => (
    <div data-testid="true-false-answer">
        <button onClick={() => onProvideAnswer({ is_true: true })}>
            Answer TF
        </button>
    </div>
));

jest.mock(
    "../../../../components/richTextEditor/TiptapEditor",
    () =>
        ({ setContent }: any) =>
            (
                <div data-testid="text-editor">
                    <button onClick={() => setContent("New explanation")}>
                        Set Explanation
                    </button>
                </div>
            )
);

jest.mock(
    "../../../../components/elements/HtmlDisplay",
    () =>
        ({ htmlContent }: any) =>
            <div data-testid="html-display">{htmlContent}</div>
);

jest.mock("./AIAssistant", () => ({ onClose }: any) => (
    <div data-testid="ai-assistant">
        AI Assistant
        <button onClick={onClose}>Close AI</button>
    </div>
));

const mockQuestion = {
    id: "q1",
    test_id: "t1",
    order: 1,
    score: 10,
    type: QUESTION_TYPE.MULTIPLE_CHOICES,
    content: {
        answer: {
            is_saved: false,
            explaination: "",
        },
    },
};

describe("Answer", () => {
    const mockSetCurrentAIChat = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useChatSocket as unknown as jest.Mock).mockReturnValue({
            setCurrentAIChat: mockSetCurrentAIChat,
        });
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            user: { id: "u1" },
        });
        (useMutation as unknown as jest.Mock).mockImplementation((options) => ({
            mutate: jest.fn(() => {
                if (options && options.onSuccess) {
                    options.onSuccess();
                }
            }),
            isLoading: false,
        }));
    });

    it("should render correctly", () => {
        render(<Answer question={mockQuestion as any} />);
        expect(screen.getByText("Question 1")).toBeInTheDocument();
        expect(screen.getByText("(10 points)")).toBeInTheDocument();
        expect(screen.getByText("Ask AI")).toBeInTheDocument();
        expect(
            screen.getByTestId("multiple-choices-answer")
        ).toBeInTheDocument();
    });

    it("should show saved status if answer is saved", () => {
        const savedQuestion = {
            ...mockQuestion,
            content: {
                answer: { is_saved: true },
            },
        };
        render(<Answer question={savedQuestion as any} />);
        expect(screen.getByText("Saved")).toBeInTheDocument();
    });

    it("should handle providing answer and saving", async () => {
        render(<Answer question={mockQuestion as any} />);

        // Simulate providing answer
        fireEvent.click(screen.getByText("Answer MC"));

        // Save button should appear
        const saveButton = screen.getByText("Save");
        expect(saveButton).toBeInTheDocument();

        // Click save
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(createTestActions.saveTestQuestions).toHaveBeenCalled();
        });
        expect(useDispatch()).toHaveBeenCalled();
    });

    it("should handle explanation editing", () => {
        render(<Answer question={mockQuestion as any} />);

        // Click Add explanation
        fireEvent.click(screen.getByText("Add explaination"));

        expect(screen.getByTestId("text-editor")).toBeInTheDocument();

        // Simulate changing explanation
        fireEvent.click(screen.getByText("Set Explanation"));

        // Save button should appear (savable becomes true)
        expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("should handle AI assistant", () => {
        render(<Answer question={mockQuestion as any} />);

        fireEvent.click(screen.getByText("Ask AI"));

        expect(mockSetCurrentAIChat).toHaveBeenCalled();
        expect(screen.getByTestId("ai-assistant")).toBeInTheDocument();

        // Close AI
        fireEvent.click(screen.getByText("Close AI"));
        expect(screen.queryByTestId("ai-assistant")).not.toBeInTheDocument();
    });

    it("should handle cancel", () => {
        render(<Answer question={mockQuestion as any} />);

        // Make changes to show save/cancel buttons
        fireEvent.click(screen.getByText("Answer MC"));

        const cancelButton = screen.getByText("Cancel");
        fireEvent.click(cancelButton);

        expect(screen.queryByText("Save")).not.toBeInTheDocument();
    });

    it("should render different answer types", () => {
        const qFG = { ...mockQuestion, type: QUESTION_TYPE.FILL_IN_THE_GAPS };
        const { rerender } = render(<Answer question={qFG as any} />);
        expect(screen.getByTestId("fill-gaps-answer")).toBeInTheDocument();

        const qMA = { ...mockQuestion, type: QUESTION_TYPE.MATCHING };
        rerender(<Answer question={qMA as any} />);
        expect(screen.getByTestId("matching-answer")).toBeInTheDocument();

        const qRES = { ...mockQuestion, type: QUESTION_TYPE.RESPONSE };
        rerender(<Answer question={qRES as any} />);
        expect(screen.getByTestId("response-answer")).toBeInTheDocument();

        const qTF = { ...mockQuestion, type: QUESTION_TYPE.TRUE_FALSE };
        rerender(<Answer question={qTF as any} />);
        expect(screen.getByTestId("true-false-answer")).toBeInTheDocument();
    });
});
