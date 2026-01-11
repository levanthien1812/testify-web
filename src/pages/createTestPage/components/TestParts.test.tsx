import { render, screen } from "@testing-library/react";
import TestParts from "./TestParts";
import { useAppSelector } from "../../../hooks/hooks";
import { useMutation } from "react-query";
import { createTestActions } from "../../../stores/createTest";
import { validateParts } from "../../../services/test";
import userEvent from "@testing-library/user-event";
import { useDispatch } from "react-redux";

// Mocks
jest.mock("../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("../../../services/test", () => ({
    validateParts: jest.fn(),
}));

jest.mock("../../../stores/createTest", () => ({
    createTestActions: {
        moveNextStep: jest.fn(),
        movePrevStep: jest.fn(),
        validate: jest.fn(),
    },
}));

jest.mock("./testParts/Part", () => ({ part }: any) => (
    <div data-testid="part">{part.name}</div>
));

jest.mock(
    "../../../components/elements/InfoMessage",
    () =>
        ({ message }: any) =>
            <div>{message}</div>
);

jest.mock("./Wrapper", () => ({ viewData, children }: any) => (
    <div>
        <h1>{viewData.headerTitle.text}</h1>
        {children}
        <button
            onClick={viewData.bottomButtons.outlinedButton.onClick}
            disabled={viewData.bottomButtons.outlinedButton.disabled}
        >
            {viewData.bottomButtons.outlinedButton.text}
        </button>
        <button
            onClick={viewData.bottomButtons.containButton.onClick}
            disabled={viewData.bottomButtons.containButton.disabled}
        >
            {viewData.bottomButtons.containButton.isLoading
                ? viewData.bottomButtons.containButton.loadingText
                : viewData.bottomButtons.containButton.text}
        </button>
    </div>
));

describe("TestParts", () => {
    const mockValidateParts = jest.fn();

    const defaultState = {
        numParts: 2,
        numQuestions: 10,
        maxScore: 100,
        testId: "test-123",
        testParts: [
            { id: "1", name: "Part 1" },
            { id: "2", name: "Part 2" },
        ],
        isValidParts: true,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppSelector as unknown as jest.Mock).mockReturnValue(defaultState);
        (validateParts as jest.Mock).mockImplementation(mockValidateParts);

        (useMutation as jest.Mock).mockImplementation((options) => ({
            mutate: jest.fn((data) => {
                if (options.mutationFn) {
                    options.mutationFn(data);
                }
                if (options.onSuccess) {
                    options.onSuccess();
                }
            }),
            isLoading: false,
        }));
    });

    it("should render correctly", () => {
        render(<TestParts />);
        expect(screen.getByText("Test Parts")).toBeInTheDocument();
        expect(screen.getByText("100")).toBeInTheDocument(); // maxScore
        expect(screen.getByText("10")).toBeInTheDocument(); // numQuestions
        expect(screen.getAllByTestId("part")).toHaveLength(2);
    });

    it("should dispatch validate on mount", () => {
        render(<TestParts />);
        expect(createTestActions.validate).toHaveBeenCalled();
        expect(useDispatch()).toHaveBeenCalled();
    });

    it("should show warning message if parts are invalid", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            ...defaultState,
            isValidParts: false,
        });
        render(<TestParts />);
        expect(
            screen.getByText(/Total parts scores and questions must be equal/i)
        ).toBeInTheDocument();
        expect(screen.getByText("Next")).toBeDisabled();
    });

    it("should render message when numParts is 0", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            ...defaultState,
            numParts: 0,
            testParts: [],
        });
        render(<TestParts />);
        expect(
            screen.getByText(/Your test doesn't have multiple parts/i)
        ).toBeInTheDocument();
    });

    it("should call validateParts mutation and move next step on Next click", async () => {
        const user = userEvent.setup();
        const mockMutate = jest.fn();
        (useMutation as jest.Mock).mockImplementation((options) => ({
            mutate: () => {
                mockMutate();
                if (options.mutationFn) options.mutationFn();
                if (options.onSuccess) options.onSuccess();
            },
            isLoading: false,
        }));

        render(<TestParts />);
        await user.click(screen.getByText("Next"));

        expect(mockMutate).toHaveBeenCalled();
        expect(validateParts).toHaveBeenCalledWith("test-123");
        expect(createTestActions.moveNextStep).toHaveBeenCalled();
        expect(useDispatch()).toHaveBeenCalled();
    });

    it("should dispatch movePrevStep on Back click", async () => {
        const user = userEvent.setup();
        render(<TestParts />);
        await user.click(screen.getByText("Back"));

        expect(createTestActions.movePrevStep).toHaveBeenCalled();
        expect(useDispatch()).toHaveBeenCalled();
    });

    it("should show loading state on Next button", () => {
        (useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isLoading: true,
        });
        render(<TestParts />);
        expect(screen.getByText("Validating...")).toBeInTheDocument();
        expect(screen.getByText("Validating...")).toBeDisabled();
    });
});
