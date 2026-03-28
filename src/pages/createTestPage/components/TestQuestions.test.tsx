import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TestQuestions from "./TestQuestions";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/hooks";
import { createTestActions } from "../../../stores/createTest";
import { useMutation } from "react-query";
import { validateQuestions } from "../../../services/test";

// Mocks
jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));

jest.mock("../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("react-query", () => ({
    useMutation: jest.fn(),
}));

jest.mock("../../../services/test", () => ({
    validateQuestions: jest.fn(),
}));

jest.mock("../../../stores/createTest", () => ({
    createTestActions: {
        moveNextStep: jest.fn(),
        movePrevStep: jest.fn(),
        validate: jest.fn(),
        initializeTestQuestions: jest.fn(),
    },
}));

jest.mock("./testQuestions/Questions", () => ({ part }: any) => (
    <div data-testid="questions-component">
        Questions {part ? part.name : "Global"}
    </div>
));

jest.mock(
    "../../../components/elements/InfoMessage",
    () =>
        ({ message, type }: any) =>
            <div data-testid={`info-message-${type}`}>{message}</div>
);

jest.mock("./Wrapper", () => ({ viewData, children }: any) => (
    <div data-testid="wrapper">
        <h1>{viewData.headerTitle.text}</h1>
        <button
            onClick={viewData.bottomButtons.outlinedButton.onClick}
            data-testid="back-btn"
        >
            {viewData.bottomButtons.outlinedButton.text}
        </button>
        <button
            onClick={viewData.bottomButtons.containButton.onClick}
            disabled={viewData.bottomButtons.containButton.disabled}
            data-testid="next-btn"
        >
            {viewData.bottomButtons.containButton.isLoading
                ? viewData.bottomButtons.containButton.loadingText
                : viewData.bottomButtons.containButton.text}
        </button>
        {children}
    </div>
));

describe("TestQuestions", () => {
    const mockDispatch = jest.fn();
    const mockMutate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        (useMutation as jest.Mock).mockImplementation((options) => ({
            mutate: jest.fn(() => {
                mockMutate();
                if (options && options.mutationFn) {
                    options.mutationFn();
                }
                if (options && options.onSuccess) {
                    options.onSuccess();
                }
            }),
            isLoading: false,
        }));
        (
            createTestActions.moveNextStep as unknown as jest.Mock
        ).mockReturnValue({ type: "MOVE_NEXT" });
        (
            createTestActions.movePrevStep as unknown as jest.Mock
        ).mockReturnValue({ type: "MOVE_PREV" });
        (createTestActions.validate as unknown as jest.Mock).mockReturnValue({
            type: "VALIDATE",
        });
        (
            createTestActions.initializeTestQuestions as unknown as jest.Mock
        ).mockReturnValue({ type: "INIT_QUESTIONS" });
    });

    it("should render correctly and initialize", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
            testParts: [],
            isValidQuestions: true,
        });

        render(<TestQuestions />);

        expect(screen.getByTestId("wrapper")).toBeInTheDocument();
        expect(screen.getByText("Questions")).toBeInTheDocument();
        expect(createTestActions.initializeTestQuestions).toHaveBeenCalled();
        expect(createTestActions.validate).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith({ type: "INIT_QUESTIONS" });
        expect(mockDispatch).toHaveBeenCalledWith({ type: "VALIDATE" });
    });

    it("should show warning if questions are invalid", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
            testParts: [],
            isValidQuestions: false,
        });

        render(<TestQuestions />);

        expect(screen.getByTestId("info-message-warning")).toBeInTheDocument();
        expect(screen.getByTestId("next-btn")).toBeDisabled();
    });

    it("should render single Questions component when parts <= 1", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
            testParts: [{ id: "p1", name: "Part 1", questions: [] }], // length 1
            isValidQuestions: true,
        });

        render(<TestQuestions />);

        const questions = screen.getAllByTestId("questions-component");
        expect(questions).toHaveLength(1);
        expect(screen.getByText("Questions Global")).toBeInTheDocument();
    });

    it("should render multiple Questions components when parts > 1", () => {
        const mockParts = [
            { id: "p1", name: "Part 1", questions: [{ id: "q1" }] },
            { id: "p2", name: "Part 2", questions: [{ id: "q2" }] },
        ];
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
            testParts: mockParts,
            isValidQuestions: true,
        });

        render(<TestQuestions />);

        const questions = screen.getAllByTestId("questions-component");
        expect(questions).toHaveLength(2);
        expect(screen.getByText("Questions Part 1")).toBeInTheDocument();
        expect(screen.getByText("Questions Part 2")).toBeInTheDocument();
    });

    it("should handle Next button click", async () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
            testParts: [],
            isValidQuestions: true,
        });

        render(<TestQuestions />);

        fireEvent.click(screen.getByTestId("next-btn"));

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalled();
        });
        expect(validateQuestions).toHaveBeenCalledWith("test-123");
        expect(createTestActions.moveNextStep).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith({ type: "MOVE_NEXT" });
    });

    it("should handle Back button click", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
            testParts: [],
            isValidQuestions: true,
        });

        render(<TestQuestions />);

        fireEvent.click(screen.getByTestId("back-btn"));

        expect(createTestActions.movePrevStep).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith({ type: "MOVE_PREV" });
    });

    it("should show loading state", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
            testParts: [],
            isValidQuestions: true,
        });
        (useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isLoading: true,
        });

        render(<TestQuestions />);

        expect(screen.getByText("Validating...")).toBeInTheDocument();
        expect(screen.getByTestId("next-btn")).toBeDisabled();
    });
});
