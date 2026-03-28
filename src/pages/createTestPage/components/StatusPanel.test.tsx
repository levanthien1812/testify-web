import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StatusPanel from "./StatusPanel";
import { useAppSelector } from "../../../hooks/hooks";
import { useMutation } from "react-query";
import { publishTest } from "../../../services/test";
import { toast } from "react-toastify";
import { TEST_STATUS } from "../../../config/constants/tests";

// Mocks
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock("../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("react-query", () => ({
    useMutation: jest.fn(),
}));

jest.mock("../../../services/test", () => ({
    publishTest: jest.fn(),
}));

jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
    },
}));

jest.mock(
    "../../../components/elements/Button",
    () =>
        ({ children, onClick, disabled, className }: any) =>
            (
                <button
                    onClick={onClick}
                    disabled={disabled}
                    className={className}
                >
                    {children}
                </button>
            )
);

jest.mock("@fortawesome/react-fontawesome", () => ({
    FontAwesomeIcon: () => <span>Icon</span>,
}));

describe("StatusPanel", () => {
    const mockMutate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
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
    });

    it("should not render when status is DRAFT", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
            status: TEST_STATUS.DRAFT,
        });

        render(<StatusPanel />);
        expect(
            screen.queryByText("This test is now publishable!")
        ).not.toBeInTheDocument();
    });

    it("should render publishable state correctly", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
            status: TEST_STATUS.PUBLISHABLE,
        });

        render(<StatusPanel />);
        expect(
            screen.getByText("This test is now publishable!")
        ).toBeInTheDocument();
        expect(screen.getByText("Publish")).toBeInTheDocument();
        expect(screen.getByText("Dismiss")).toBeInTheDocument();
    });

    it("should handle publish action", async () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
            status: TEST_STATUS.PUBLISHABLE,
        });

        render(<StatusPanel />);
        fireEvent.click(screen.getByText("Publish"));

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalled();
        });
        expect(publishTest).toHaveBeenCalledWith("test-123");
        expect(toast.success).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should handle dismiss and restore", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
            status: TEST_STATUS.PUBLISHABLE,
        });

        render(<StatusPanel />);

        // Dismiss
        fireEvent.click(screen.getByText("Dismiss"));
        expect(
            screen.queryByText("This test is now publishable!")
        ).not.toBeInTheDocument();
        expect(screen.getByText("Icon")).toBeInTheDocument(); // FontAwesomeIcon mock

        // Restore
        // fireEvent.click(screen.getByText("Icon").closest("button")!);
        fireEvent.click(screen.getByRole("button", { name: "Icon" }));
        expect(
            screen.getByText("This test is now publishable!")
        ).toBeInTheDocument();
    });

    it("should render opened state correctly when transitioned from publishable", () => {
        // Initial render as PUBLISHABLE to set open=true
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
            status: TEST_STATUS.PUBLISHABLE,
        });

        const { rerender } = render(<StatusPanel />);
        expect(
            screen.getByText("This test is now publishable!")
        ).toBeInTheDocument();

        // Update to OPENED
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
            status: TEST_STATUS.OPENED,
        });

        rerender(<StatusPanel />);

        expect(
            screen.getByText(/This test is now published\/opened!/)
        ).toBeInTheDocument();
        expect(screen.getByText("Got it!")).toBeInTheDocument();
    });

    it("should show loading state during publish", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
            status: TEST_STATUS.PUBLISHABLE,
        });
        (useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isLoading: true,
        });

        render(<StatusPanel />);
        expect(screen.getByText("Publishing...")).toBeInTheDocument();
        expect(screen.getByText("Publishing...")).toBeDisabled();
    });
});
