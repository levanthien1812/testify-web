import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from "@testing-library/react";
import CopyLink from "./CopyLink";
import { toast } from "react-toastify";

// Mock dependencies
jest.mock("../../../../components/elements/Input", () => (props: any) => (
    <input data-testid="mock-input" {...props} />
));

jest.mock(
    "../../../../components/elements/Button",
    () =>
        ({ children, onClick, disabled }: any) =>
            (
                <button onClick={onClick} disabled={disabled}>
                    {children}
                </button>
            )
);

jest.mock("../../../../config/constants/tests", () => ({
    DISABLE_COPY_TIMEOUT: 1000,
}));

jest.mock("../../../../config/constants/toasts", () => ({
    TOAST_MESSAGES: {
        UNABLE_TO_COPY: "Unable to copy",
    },
}));

describe("CopyLink", () => {
    const mockLink = "https://testify.com/test/123";

    // Setup clipboard mock
    const mockWriteText = jest.fn();
    Object.assign(navigator, {
        clipboard: {
            writeText: mockWriteText,
        },
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should render correctly", () => {
        render(<CopyLink link={mockLink} />);

        const input = screen.getByTestId("mock-input");
        expect(input).toHaveValue(mockLink);
        expect(input).toBeDisabled();

        expect(screen.getByText("Copy link")).toBeInTheDocument();
    });

    it("should handle successful copy", async () => {
        mockWriteText.mockResolvedValue(undefined);

        render(<CopyLink link={mockLink} />);

        const button = screen.getByText("Copy link");
        fireEvent.click(button);

        expect(mockWriteText).toHaveBeenCalledWith(mockLink);

        // State update is async inside handleCopy (await writeText)
        await waitFor(() => {
            expect(screen.getByText("Link copied")).toBeInTheDocument();
        });

        const copiedButton = screen.getByText("Link copied");
        expect(copiedButton).toBeDisabled();

        // Fast forward timer
        act(() => {
            jest.advanceTimersByTime(1000);
        });

        await waitFor(() => {
            expect(screen.getByText("Copy link")).toBeInTheDocument();
        });
        expect(screen.getByText("Copy link")).not.toBeDisabled();
    });

    it("should handle copy failure", async () => {
        mockWriteText.mockRejectedValue(new Error("Failed"));

        render(<CopyLink link={mockLink} />);

        const button = screen.getByText("Copy link");
        fireEvent.click(button);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Unable to copy");
        });

        expect(screen.queryByText("Link copied")).not.toBeInTheDocument();
    });
});
