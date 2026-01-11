import { render, screen, fireEvent } from "@testing-library/react";
import Questions from "./Questions";
import { useAppSelector } from "../../../../hooks/hooks";
import { setEqualHeight } from "../../../../utils/components";

// Mocks
jest.mock("../../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("../../../../utils/components", () => ({
    setEqualHeight: jest.fn(),
}));

jest.mock("../../../../utils/primitives", () => ({
    getRound: (val: number) => val,
}));

jest.mock("../../../../utils/text", () => ({
    shorten: (text: string) => text,
}));

jest.mock("./Question", () => ({ question, playAudio }: any) => (
    <div data-testid="question-item">
        Question {question.id}
        <button onClick={playAudio}>Play Audio</button>
    </div>
));

jest.mock("../testAnswers/Answer", () => ({ question }: any) => (
    <div data-testid="answer-item">Answer {question.id}</div>
));

jest.mock(
    "../../../../components/accordions/Accordion",
    () =>
        ({ children, viewData }: any) =>
            (
                <div data-testid="accordion">
                    <div data-testid="accordion-title">
                        {viewData.title.text}
                    </div>
                    {viewData.open && (
                        <div data-testid="accordion-content">{children}</div>
                    )}
                </div>
            )
);

describe("Questions", () => {
    const mockTestQuestions = [
        { id: "q1", content: { text: "Q1" } },
        { id: "q2", content: { text: "Q2" } },
    ];

    const mockPart = {
        id: "p1",
        order: 1,
        name: "Part 1",
        score: 10,
        num_questions: 2,
        questions: [
            { id: "pq1", content: { text: "PQ1" } },
            { id: "pq2", content: { text: "PQ2" } },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testQuestions: mockTestQuestions,
            openAllParts: true,
        });

        // Mock HTMLMediaElement play
        window.HTMLMediaElement.prototype.play = jest.fn();
    });

    it("should render global questions when no part is provided", () => {
        render(<Questions />);
        expect(screen.getAllByTestId("question-item")).toHaveLength(2);
        expect(screen.getByText("Question q1")).toBeInTheDocument();
        expect(screen.queryByTestId("accordion")).not.toBeInTheDocument();
    });

    it("should render part questions inside accordion when part is provided", () => {
        render(<Questions part={mockPart as any} />);
        expect(screen.getByTestId("accordion")).toBeInTheDocument();
        expect(screen.getByTestId("accordion-title")).toHaveTextContent(
            "Part 1: Part 1"
        );
        expect(screen.getAllByTestId("question-item")).toHaveLength(2);
        expect(screen.getByText("Question pq1")).toBeInTheDocument();
    });

    it("should render answers when withAnswer is true", () => {
        render(<Questions part={mockPart as any} withAnswer={true} />);
        expect(screen.getAllByTestId("answer-item")).toHaveLength(2);
        expect(screen.getByText("Answer pq1")).toBeInTheDocument();
        expect(screen.queryByTestId("question-item")).not.toBeInTheDocument();
    });

    it("should call setEqualHeight on mount", () => {
        render(<Questions />);
        expect(setEqualHeight).toHaveBeenCalled();
    });

    it("should play audio when playAudio is called from child", () => {
        render(<Questions />);
        const playButton = screen.getAllByText("Play Audio")[0];
        fireEvent.click(playButton);

        expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
    });

    it("should handle resize event", () => {
        render(<Questions />);
        fireEvent(window, new Event("resize"));
        // Once on mount, once on resize
        expect(setEqualHeight).toHaveBeenCalledTimes(2);
    });
});
