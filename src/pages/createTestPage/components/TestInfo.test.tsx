import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import TestInfo from "./TestInfo";
import { useAppSelector } from "../../../hooks/hooks";
import { useMutation } from "react-query";
import { createTestActions } from "../../../stores/createTest";
import { createTest, updateTest } from "../../../services/test";
import userEvent from "@testing-library/user-event";

// Mocks
jest.mock("../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("../../../services/test", () => ({
    createTest: jest.fn(),
    updateTest: jest.fn(),
}));

jest.mock("../../../stores/createTest", () => ({
    createTestActions: {
        movePrevStep: jest.fn(),
        moveNextStep: jest.fn(),
        saveTestInfo: jest.fn(),
        validate: jest.fn(),
        initializeTestParts: jest.fn(),
    },
}));

jest.mock("./testInfo/TestOptions", () => () => (
    <div data-testid="test-options">Test Options</div>
));

// Mock Wrapper to expose the Next/Back buttons for testing
jest.mock("./Wrapper", () => ({ viewData, children }: any) => (
    <div>
        {children}
        <button
            onClick={viewData.bottomButtons.outlinedButton.onClick}
            disabled={viewData.bottomButtons.outlinedButton.disabled}
        >
            Back
        </button>
        <button
            onClick={viewData.bottomButtons.containButton.onClick}
            disabled={viewData.bottomButtons.containButton.disabled}
        >
            Next
        </button>
    </div>
));

describe("TestInfo", () => {
    const mockCreateTest = jest.fn();
    const mockUpdateTest = jest.fn();

    const defaultState = {
        testTitle: "",
        testDatetime: new Date(Date.now() + 86400000).toISOString(),
        testDescription: "",
        testDuration: 60,
        testId: null,
        level: "EASY",
        numParts: 2,
        numQuestions: 10,
        maxScore: 100,
        isValidTestInfo: true,
        options: {
            allow_close_time: { enable: false },
            allow_show_maker_answers_after_test: { enable: false },
            disallow_time_limit: { enable: false },
            require_screen_recorder: { enable: false },
            require_camera_on: { enable: false },
        },
        editibility: {
            TEST_INFORMATION: {
                title: true,
                description: true,
                datetime: true,
                max_score: true,
                num_parts: true,
                num_questions: true,
                level: true,
            },
        },
        testParts: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (createTest as jest.Mock).mockImplementation(mockCreateTest);
        (updateTest as jest.Mock).mockImplementation(mockUpdateTest);

        (useMutation as jest.Mock).mockImplementation((options) => ({
            mutate: jest.fn((data) => {
                // Simulate calling the mutation function (createTest or updateTest)
                options.mutationFn(data);
                // Simulate success
                if (options.onSuccess) {
                    options.onSuccess({ test: { id: "new-test-id" } });
                }
            }),
            isLoading: false,
        }));

        (useAppSelector as unknown as jest.Mock).mockReturnValue(defaultState);
    });

    it("should render all inputs correctly", () => {
        render(<TestInfo />);
        expect(screen.getByLabelText(/Test title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Test description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Start time/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Duration/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Max score/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Number of parts/i)).toBeInTheDocument();
        expect(
            screen.getByLabelText(/Number of questions/i)
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/Level/i)).toBeInTheDocument();
        expect(screen.getByTestId("test-options")).toBeInTheDocument();
    });

    it("should display validation error when title is empty and form is submitted", async () => {
        const user = userEvent.setup();
        render(<TestInfo />);

        const nextButton = screen.getByText("Next");
        await user.click(nextButton);

        expect(
            await screen.findByText("Title is required")
        ).toBeInTheDocument();
    });

    it("should call createTest mutation when testId is null", async () => {
        const user = userEvent.setup();
        render(<TestInfo />);

        await user.type(screen.getByLabelText(/Test title/i), "New Test");
        await user.click(screen.getByText("Next"));

        await waitFor(() => {
            expect(mockCreateTest).toHaveBeenCalled();
        });
        expect(createTestActions.saveTestInfo).toHaveBeenCalled();
        expect(createTestActions.moveNextStep).toHaveBeenCalled();
    });

    it("should call updateTest mutation when testId is present", async () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            ...defaultState,
            testId: "existing-id",
            testTitle: "Existing Test",
        });

        const user = userEvent.setup();
        render(<TestInfo />);

        // Ensure form is initialized with existing data
        expect(screen.getByLabelText(/Test title/i)).toHaveValue(
            "Existing Test"
        );

        await user.click(screen.getByText("Next"));

        await waitFor(() => {
            expect(mockUpdateTest).toHaveBeenCalled();
        });
        expect(createTestActions.moveNextStep).toHaveBeenCalled();
    });

    it("should disable Next button if isValidTestInfo is false", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            ...defaultState,
            isValidTestInfo: false,
        });

        render(<TestInfo />);
        expect(screen.getByText("Next")).toBeDisabled();
    });

    it("should have disabled Back button", () => {
        render(<TestInfo />);
        expect(screen.getByText("Back")).toBeDisabled();
    });
});
