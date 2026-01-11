import { fireEvent, render, screen } from "@testing-library/react";
import QuestionDraggable from "./QuestionDraggable";
import { useAppSelector } from "../../../../hooks/hooks";
import { useDispatch } from "react-redux";
import { useMutation } from "react-query";
import { createTestActions } from "../../../../stores/createTest";
import { reorderQuestions } from "../../../../services/test";

jest.mock("../../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("../../../../services/test", () => ({
    reorderQuestions: jest.fn(),
}));

jest.mock("../../../../stores/createTest", () => ({
    createTestActions: {
        handleReorderQuestion: jest.fn(),
    },
}));

jest.mock(
    "../../../../components/elements/HtmlDisplay",
    () =>
        ({ htmlContent }: any) =>
            <div data-testid="html-display">{htmlContent}</div>
);

jest.mock("@fortawesome/react-fontawesome", () => ({
    FontAwesomeIcon: () => <span data-testid="fa-icon">Icon</span>,
}));

jest.mock("../../../../utils/mapping", () => ({
    questionTypeToIcon: {
        MULTIPLE_CHOICES: "mock-icon",
    },
}));

jest.mock("../../../../utils/primitives", () => ({
    getRound: (val: number) => val,
}));

describe("QuestionDraggable", () => {
    const mockReorderMutate = jest.fn();

    const defaultQuestion = {
        id: "q1",
        order: 1,
        score: 10,
        type: "MULTIPLE_CHOICES",
        is_content_provided: true,
        content: { text: "<p>Question Text</p>" },
        part_id: "p1",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
        });
        (useMutation as jest.Mock).mockReturnValue({
            mutate: mockReorderMutate,
        });
    });

    it("should render correctly", () => {
        render(
            <QuestionDraggable
                question={defaultQuestion as any}
                onClick={jest.fn()}
            />
        );
        expect(screen.getByText("Question 1")).toBeInTheDocument();
        expect(screen.getByText("10 pts")).toBeInTheDocument();
        expect(screen.getByTestId("html-display")).toHaveTextContent(
            "<p>Question Text</p>"
        );
        expect(screen.getByTestId("fa-icon")).toBeInTheDocument();
    });

    it("should call onClick when clicked", () => {
        const onClick = jest.fn();
        render(
            <QuestionDraggable
                question={defaultQuestion as any}
                onClick={onClick}
            />
        );
        const container = screen.getByTestId(
            `question-drag-${defaultQuestion.order}`
        );
        fireEvent.click(container!);
        expect(onClick).toHaveBeenCalled();
    });

    it("should handle drag start", () => {
        render(
            <QuestionDraggable
                question={defaultQuestion as any}
                onClick={jest.fn()}
            />
        );
        const container = screen.getByTestId(
            `question-drag-${defaultQuestion.order}`
        );

        const dataTransfer = {
            setData: jest.fn(),
        };

        fireEvent.dragStart(container!, { dataTransfer });

        expect(dataTransfer.setData).toHaveBeenCalledWith("start_index", "1");
        expect(dataTransfer.setData).toHaveBeenCalledWith(
            "part_id",
            JSON.stringify("p1")
        );
    });

    it("should handle drop and reorder", () => {
        render(
            <QuestionDraggable
                question={defaultQuestion as any}
                onClick={jest.fn()}
            />
        );
        const container = screen.getByTestId(
            `question-drag-${defaultQuestion.order}`
        );

        const dataTransfer = {
            getData: jest.fn((key) => {
                if (key === "start_index") return "2"; // Dragging question 2
                if (key === "part_id") return JSON.stringify("p1");
                return "";
            }),
        };

        fireEvent.drop(container!, { dataTransfer });

        expect(createTestActions.handleReorderQuestion).toHaveBeenCalledWith({
            startOrder: 2,
            endOrder: 1,
            partFromId: "p1",
            partToId: "p1",
        });
        expect(mockReorderMutate).toHaveBeenCalledWith({
            startOrder: 2,
            endOrder: 1,
            partFromId: "p1",
            partToId: "p1",
        });
    });

    it("should not reorder if dropped on self", () => {
        render(
            <QuestionDraggable
                question={defaultQuestion as any}
                onClick={jest.fn()}
            />
        );
        const container = screen.getByTestId(
            `question-drag-${defaultQuestion.order}`
        );

        const dataTransfer = {
            getData: jest.fn((key) => {
                if (key === "start_index") return "1";
                if (key === "part_id") return JSON.stringify("p1");
                return "";
            }),
        };

        fireEvent.drop(container!, { dataTransfer });

        expect(createTestActions.handleReorderQuestion).not.toHaveBeenCalled();
        expect(mockReorderMutate).not.toHaveBeenCalled();
    });

    it("should render correctly when content is not provided", () => {
        const questionNoContent = {
            ...defaultQuestion,
            is_content_provided: false,
        };
        render(
            <QuestionDraggable
                question={questionNoContent as any}
                onClick={jest.fn()}
            />
        );
        const container = screen.getByTestId(
            `question-drag-${defaultQuestion.order}`
        );
        expect(container).toHaveClass("hover:shadow-orange-200");
    });

    it("should not render HtmlDisplay if content is missing", () => {
        const questionNoText = { ...defaultQuestion, content: undefined };
        render(
            <QuestionDraggable
                question={questionNoText as any}
                onClick={jest.fn()}
            />
        );
        expect(screen.queryByTestId("html-display")).not.toBeInTheDocument();
    });
});
