import { render, screen, act } from "@testing-library/react";
import CreateTestPage from "./CreateTestPage";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/hooks";
import { createTestActions } from "../../stores/createTest";
import { useSearchParams } from "react-router-dom";
import { useParams, useLocation, useNavigate } from "react-router";
import { CREATE_TEST_STEPS } from "../../config/constants/tests";

// Mocks
jest.mock("react-query", () => ({
    useQuery: jest.fn(),
}));
jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));
jest.mock("../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
    useSearchParams: jest.fn(),
}));
jest.mock("react-router", () => ({
    useParams: jest.fn(),
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
}));
jest.mock("../../services/test", () => ({
    getTest: jest.fn(),
}));
jest.mock("../../stores/createTest", () => ({
    createTestActions: {
        setTestFromAPI: jest.fn(),
        setStep: jest.fn(),
        saveTestInfo: jest.fn(),
        reset: jest.fn(),
        navigateStep: jest.fn(),
    },
}));
jest.mock("axios", () => ({
    AxiosError: class extends Error {
        response: any;
        constructor(message?: string) {
            super(message);
            this.name = "AxiosError";
        }
    },
}));

// Mock child components
jest.mock("./components/TestInfo", () => () => (
    <div data-testid="test-info">TestInfo</div>
));
jest.mock("./components/TestParts", () => () => (
    <div data-testid="test-parts">TestParts</div>
));
jest.mock("./components/TestQuestions", () => () => (
    <div data-testid="test-questions">TestQuestions</div>
));
jest.mock("./components/TestAnswers", () => () => (
    <div data-testid="test-answers">TestAnswers</div>
));
jest.mock("./components/TestSharing", () => () => (
    <div data-testid="test-sharing">TestSharing</div>
));
jest.mock("./components/Navigator", () => () => (
    <div data-testid="navigator">Navigator</div>
));
jest.mock("./components/StatusPanel", () => () => (
    <div data-testid="status-panel">StatusPanel</div>
));
jest.mock("./components/CreateTestTour", () => () => (
    <div data-testid="create-test-tour">CreateTestTour</div>
));
jest.mock(
    "../../components/loadings/Loading",
    () =>
        ({ isLoading }: any) =>
            isLoading ? <div data-testid="loading">Loading...</div> : null
);
jest.mock("../others/MessageAction", () => ({ message }: any) => (
    <div data-testid="error-message">{message.text}</div>
));

describe("CreateTestPage", () => {
    const mockDispatch = jest.fn();
    const mockNavigate = jest.fn();
    const mockSetSearchParams = jest.fn();
    const mockSearchParams = { get: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useSearchParams as jest.Mock).mockReturnValue([
            mockSearchParams,
            mockSetSearchParams,
        ]);
        (useLocation as jest.Mock).mockReturnValue({ state: {} });
        (useParams as jest.Mock).mockReturnValue({});
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            currentStep: CREATE_TEST_STEPS.TEST_INFORMATION,
            testTitle: "Test Title",
        });
        (useQuery as jest.Mock).mockReturnValue({
            data: null,
            isLoading: false,
            refetch: jest.fn(),
        });

        (
            createTestActions.setTestFromAPI as unknown as jest.Mock
        ).mockReturnValue({ type: "SET_TEST" });
        (
            createTestActions.saveTestInfo as unknown as jest.Mock
        ).mockReturnValue({ type: "SAVE_INFO" });
        (createTestActions.reset as unknown as jest.Mock).mockReturnValue({
            type: "RESET",
        });
        (
            createTestActions.navigateStep as unknown as jest.Mock
        ).mockReturnValue({ type: "NAVIGATE" });
    });

    it("should render loading state", () => {
        (useQuery as jest.Mock).mockReturnValue({
            isLoading: true,
        });
        render(<CreateTestPage />);
        expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    it("should render error state", () => {
        const errorMsg = "Failed to load";
        let capturedOptions: any;
        (useQuery as jest.Mock).mockImplementation((options) => {
            capturedOptions = options;
            return { isLoading: false };
        });

        render(<CreateTestPage />);

        act(() => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { AxiosError } = require("axios");
            const axiosError = new AxiosError();
            axiosError.response = { data: { message: errorMsg } } as any;
            if (capturedOptions && capturedOptions.onError) {
                capturedOptions.onError(axiosError);
            }
        });

        expect(screen.getByTestId("error-message")).toHaveTextContent(errorMsg);
    });

    it("should render TestInfo step by default (create mode)", () => {
        render(<CreateTestPage />);
        expect(screen.getByTestId("test-info")).toBeInTheDocument();
        expect(screen.getByTestId("navigator")).toBeInTheDocument();
        expect(screen.getByTestId("status-panel")).toBeInTheDocument();
        expect(screen.getByTestId("create-test-tour")).toBeInTheDocument();
    });

    it("should render TestParts step", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            currentStep: CREATE_TEST_STEPS.TEST_PARTS,
        });
        render(<CreateTestPage />);
        expect(screen.getByTestId("test-parts")).toBeInTheDocument();
    });

    it("should render TestQuestions step", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            currentStep: CREATE_TEST_STEPS.TEST_QUESTIONS,
        });
        render(<CreateTestPage />);
        expect(screen.getByTestId("test-questions")).toBeInTheDocument();
    });

    it("should render TestAnswers step", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            currentStep: CREATE_TEST_STEPS.TEST_ANSWERS,
        });
        render(<CreateTestPage />);
        expect(screen.getByTestId("test-answers")).toBeInTheDocument();
    });

    it("should render TestSharing step", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            currentStep: CREATE_TEST_STEPS.TEST_TAKERS,
        });
        render(<CreateTestPage />);
        expect(screen.getByTestId("test-sharing")).toBeInTheDocument();
    });

    it("should fetch test if testId param is present", () => {
        (useParams as jest.Mock).mockReturnValue({ testId: "123" });
        const mockRefetch = jest.fn();
        (useQuery as jest.Mock).mockReturnValue({
            data: { id: "123" },
            isLoading: false,
            refetch: mockRefetch,
        });

        render(<CreateTestPage />);
        expect(mockRefetch).toHaveBeenCalled();
    });

    it("should dispatch saveTestInfo if location state has givenDate", () => {
        const date = "2024-01-01";
        (useLocation as jest.Mock).mockReturnValue({
            state: { givenDate: date },
        });
        render(<CreateTestPage />);
        expect(createTestActions.saveTestInfo).toHaveBeenCalledWith({
            datetime: new Date(date).toISOString(),
        });
        expect(mockDispatch).toHaveBeenCalledWith({ type: "SAVE_INFO" });
    });

    it("should update search params when currentStep changes", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            currentStep: CREATE_TEST_STEPS.TEST_PARTS,
        });
        render(<CreateTestPage />);
        expect(mockSetSearchParams).toHaveBeenCalledWith({
            step: CREATE_TEST_STEPS.TEST_PARTS,
        });
    });

    it("should navigate step if step param exists and testTitle is present", () => {
        mockSearchParams.get.mockReturnValue("TEST_QUESTIONS");
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            currentStep: CREATE_TEST_STEPS.TEST_INFORMATION,
            testTitle: "Some Title",
        });

        render(<CreateTestPage />);
        expect(createTestActions.navigateStep).toHaveBeenCalledWith(
            "TEST_QUESTIONS"
        );
        expect(mockDispatch).toHaveBeenCalledWith({ type: "NAVIGATE" });
    });

    it("should dispatch reset on unmount", () => {
        const { unmount } = render(<CreateTestPage />);
        unmount();
        expect(createTestActions.reset).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith({ type: "RESET" });
    });
});
