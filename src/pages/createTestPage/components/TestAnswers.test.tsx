import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TestAnswers from "./TestAnswers";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/hooks";
import { createTestActions } from "../../../stores/createTest";

jest.mock("../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("../../../stores/createTest", () => ({
    createTestActions: {
        moveNextStep: jest.fn(),
        movePrevStep: jest.fn(),
        initializeTestAnswers: jest.fn(),
    },
}));

jest.mock("./testAnswers/Answer", () => ({ question }: any) => (
    <div data-testid="answer-component">Answer {question.id}</div>
));

jest.mock("./testQuestions/Questions", () => ({ part }: any) => (
    <div data-testid="questions-component">Questions {part.id}</div>
));

jest.mock("./Wrapper", () => ({ viewData, children }: any) => (
    <div data-testid="wrapper">
        <h1>{viewData.headerTitle.text}</h1>
        <button onClick={viewData.bottomButtons.outlinedButton.onClick}>
            {viewData.bottomButtons.outlinedButton.text}
        </button>
        <button onClick={viewData.bottomButtons.containButton.onClick}>
            {viewData.bottomButtons.containButton.text}
        </button>
        {children}
    </div>
));

describe("TestAnswers", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (
            createTestActions.initializeTestAnswers as unknown as jest.Mock
        ).mockReturnValue({
            type: "INIT_ANSWERS",
        });
        (
            createTestActions.moveNextStep as unknown as jest.Mock
        ).mockReturnValue({
            type: "MOVE_NEXT",
        });
        (
            createTestActions.movePrevStep as unknown as jest.Mock
        ).mockReturnValue({
            type: "MOVE_PREV",
        });
    });

    it("should render correctly and initialize answers", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            numParts: 0,
            testParts: [],
            testQuestions: [],
        });

        render(<TestAnswers />);

        expect(screen.getByTestId("wrapper")).toBeInTheDocument();
        expect(screen.getByText("Test Answers")).toBeInTheDocument();
        expect(createTestActions.initializeTestAnswers).toHaveBeenCalled();

        expect(useDispatch()).toHaveBeenCalledWith({ type: "INIT_ANSWERS" });
    });

    it("should render Questions components when numParts > 1", () => {
        const mockParts = [
            { id: "p1", name: "Part 1" },
            { id: "p2", name: "Part 2" },
        ];
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            numParts: 2,
            testParts: mockParts,
            testQuestions: [],
        });

        render(<TestAnswers />);

        const questionsComponents = screen.getAllByTestId(
            "questions-component"
        );
        expect(questionsComponents).toHaveLength(2);
        expect(screen.getByText("Questions p1")).toBeInTheDocument();
        expect(screen.getByText("Questions p2")).toBeInTheDocument();
    });

    it("should render Answer components when numParts === 0", () => {
        const mockQuestions = [
            { id: "q1", text: "Question 1" },
            { id: "q2", text: "Question 2" },
        ];
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            numParts: 0,
            testParts: [],
            testQuestions: mockQuestions,
        });

        render(<TestAnswers />);

        const answerComponents = screen.getAllByTestId("answer-component");
        expect(answerComponents).toHaveLength(2);
        expect(screen.getByText("Answer q1")).toBeInTheDocument();
        expect(screen.getByText("Answer q2")).toBeInTheDocument();
    });

    it("should handle Next button click", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            numParts: 0,
            testParts: [],
            testQuestions: [],
        });

        render(<TestAnswers />);

        fireEvent.click(screen.getByText("Next"));

        expect(createTestActions.moveNextStep).toHaveBeenCalled();
        expect(useDispatch()).toHaveBeenCalledWith({ type: "MOVE_NEXT" });
    });

    it("should handle Back button click", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            numParts: 0,
            testParts: [],
            testQuestions: [],
        });

        render(<TestAnswers />);

        fireEvent.click(screen.getByText("Back"));

        expect(createTestActions.movePrevStep).toHaveBeenCalled();
        expect(useDispatch()).toHaveBeenCalledWith({ type: "MOVE_PREV" });
    });
});
