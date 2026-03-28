import { render, screen, fireEvent } from "@testing-library/react";
import Navigator from "./Navigator";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/hooks";
import { createTestActions } from "../../../stores/createTest";
import { CREATE_TEST_STEPS } from "../../../config/constants/tests";

// Mocks
jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));

jest.mock("../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("../../../stores/createTest", () => ({
    createTestActions: {
        navigateStep: jest.fn((step) => ({
            type: "NAVIGATE_STEP",
            payload: step,
        })),
    },
}));

describe("Navigator", () => {
    const mockDispatch = jest.fn();
    const mockSteps = [
        {
            index: 1,
            value: CREATE_TEST_STEPS.TEST_INFORMATION,
            label: "Info",
            isTotallyDone: true,
            isPartiallyDone: false,
        },
        {
            index: 2,
            value: CREATE_TEST_STEPS.TEST_PARTS,
            label: "Parts",
            isTotallyDone: false,
            isPartiallyDone: true,
        },
        {
            index: 3,
            value: CREATE_TEST_STEPS.TEST_QUESTIONS,
            label: "Questions",
            isTotallyDone: false,
            isPartiallyDone: false,
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        (
            createTestActions.navigateStep as unknown as jest.Mock
        ).mockImplementation((step) => ({
            type: "NAVIGATE_STEP",
            payload: step,
        }));
    });

    it("should render steps correctly", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            steps: mockSteps,
            currentStep: CREATE_TEST_STEPS.TEST_INFORMATION,
        });

        render(<Navigator />);

        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should apply correct colors based on step status", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            steps: mockSteps,
            currentStep: CREATE_TEST_STEPS.TEST_PARTS, // Step 2 is current
        });

        render(<Navigator />);

        const step1Button = screen.getByText("1");
        const step2Button = screen.getByText("2");
        const step3Button = screen.getByText("3");

        // Step 1: isTotallyDone=true. currentStep != TEST_INFORMATION. -> orange-400
        expect(step1Button).toHaveClass("bg-orange-400");

        // Step 2: currentStep == TEST_PARTS. -> orange-600
        expect(step2Button).toHaveClass("bg-orange-600");

        // Step 3: not done, not current. -> gray-300
        expect(step3Button).toHaveClass("bg-gray-300");
    });

    it("should dispatch navigateStep when a step is clicked", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            steps: mockSteps,
            currentStep: CREATE_TEST_STEPS.TEST_INFORMATION,
        });

        render(<Navigator />);

        const step3Button = screen.getByText("3");
        fireEvent.click(step3Button);

        expect(createTestActions.navigateStep).toHaveBeenCalledWith(
            CREATE_TEST_STEPS.TEST_QUESTIONS
        );
        expect(mockDispatch).toHaveBeenCalledWith({
            type: "NAVIGATE_STEP",
            payload: CREATE_TEST_STEPS.TEST_QUESTIONS,
        });
    });
});
