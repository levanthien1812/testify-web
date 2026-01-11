import { render, screen, fireEvent, act } from "@testing-library/react";
import PasscodeLink from "./PasscodeLink";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/hooks";
import { takeTestActions } from "../../../../stores/takeTest";
import useLocalStorage from "../../../../hooks/useLocalStorage";

// Mocks
jest.mock("react-query", () => ({
    useQuery: jest.fn(),
}));

jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));

jest.mock("../../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("../../../../hooks/useLocalStorage", () => jest.fn());

jest.mock("../../../../services/test", () => ({
    getTestByCode: jest.fn(),
}));

jest.mock("../../../../stores/takeTest", () => ({
    takeTestActions: {
        setPasscode: jest.fn((payload) => ({ type: "SET_PASSCODE", payload })),
    },
}));

// Mock UI Components
jest.mock("../../../../components/modals/Modal", () => {
    const Modal = ({ children, onClose }: any) => (
        <div data-testid="modal">
            <button onClick={onClose} data-testid="modal-close">
                Close
            </button>
            {children}
        </div>
    );
    return {
        __esModule: true,
        default: Modal,
        ModalHeader: ({ title }: any) => (
            <div data-testid="modal-header">{title}</div>
        ),
        ModalBody: ({ children }: any) => (
            <div data-testid="modal-body">{children}</div>
        ),
        ModalFooter: ({ children }: any) => (
            <div data-testid="modal-footer">{children}</div>
        ),
    };
});

jest.mock("../../../../components/elements/Button", () => (props: any) => (
    <button onClick={props.onClick} disabled={props.disabled}>
        {props.children}
    </button>
));

jest.mock("../../../../components/elements/Input", () => (props: any) => (
    <div data-testid="input-wrapper">
        <input
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            data-testid="mock-input"
        />
        {props.error && <div data-testid="input-error">{props.error}</div>}
    </div>
));

describe("PasscodeLink", () => {
    const mockOnClose = jest.fn();
    const mockOnSuccess = jest.fn();
    const mockDispatch = jest.fn();
    const mockRefetch = jest.fn();
    const mockSetPasscodes = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            passcode: { code: "" },
            testLink: "",
        });
        (useLocalStorage as jest.Mock).mockReturnValue([[], mockSetPasscodes]);
        (useQuery as jest.Mock).mockReturnValue({
            isLoading: false,
            refetch: mockRefetch,
        });
    });

    it("should render correctly", () => {
        render(
            <PasscodeLink onClose={mockOnClose} onSuccess={mockOnSuccess} />
        );

        expect(screen.getByTestId("modal")).toBeInTheDocument();
        expect(screen.getByText("Test passcode or link")).toBeInTheDocument();
        expect(screen.getByText("Passcode")).toBeInTheDocument();
        expect(screen.getByText("Link")).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Enter passcode")
        ).toBeInTheDocument();
        expect(screen.getByText("Next")).toBeInTheDocument();
    });

    it("should handle switching between Passcode and Link", () => {
        render(
            <PasscodeLink onClose={mockOnClose} onSuccess={mockOnSuccess} />
        );

        fireEvent.click(screen.getByText("Link"));
        expect(screen.getByPlaceholderText("Enter link")).toBeInTheDocument();
        expect(
            screen.queryByPlaceholderText("Enter passcode")
        ).not.toBeInTheDocument();

        fireEvent.click(screen.getByText("Passcode"));
        expect(
            screen.getByPlaceholderText("Enter passcode")
        ).toBeInTheDocument();
    });

    it("should handle passcode input change", () => {
        render(
            <PasscodeLink onClose={mockOnClose} onSuccess={mockOnSuccess} />
        );

        const input = screen.getByTestId("mock-input");
        fireEvent.change(input, { target: { value: "123456" } });

        expect(takeTestActions.setPasscode).toHaveBeenCalledWith({
            code: "123456",
        });
        expect(mockDispatch).toHaveBeenCalled();
    });

    it("should call refetch on Next click when in Passcode mode", () => {
        render(
            <PasscodeLink onClose={mockOnClose} onSuccess={mockOnSuccess} />
        );

        fireEvent.click(screen.getByText("Next"));
        expect(mockRefetch).toHaveBeenCalled();
    });

    it("should handle successful validation", () => {
        const mockData = { id: "test1" };
        let queryOptions: any;
        (useQuery as jest.Mock).mockImplementation((options) => {
            queryOptions = options;
            return { isLoading: false, refetch: mockRefetch };
        });

        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            passcode: { code: "123456" },
        });

        render(
            <PasscodeLink onClose={mockOnClose} onSuccess={mockOnSuccess} />
        );

        // Trigger success manually
        act(() => {
            queryOptions.onSuccess(mockData);
        });

        expect(mockSetPasscodes).toHaveBeenCalledWith(["123456"]);
        expect(mockOnSuccess).toHaveBeenCalledWith(mockData);
    });

    it("should handle validation error", () => {
        let queryOptions: any;
        (useQuery as jest.Mock).mockImplementation((options) => {
            queryOptions = options;
            return { isLoading: false, refetch: mockRefetch };
        });

        render(
            <PasscodeLink onClose={mockOnClose} onSuccess={mockOnSuccess} />
        );

        const errorMsg = "Invalid passcode";
        // Trigger error manually
        act(() => {
            queryOptions.onError({ response: { data: { message: errorMsg } } });
        });

        expect(screen.getByTestId("input-error")).toHaveTextContent(errorMsg);
    });

    it("should render stored passcodes and handle click", () => {
        (useLocalStorage as jest.Mock).mockReturnValue([
            ["stored1", "stored2"],
            mockSetPasscodes,
        ]);

        render(
            <PasscodeLink onClose={mockOnClose} onSuccess={mockOnSuccess} />
        );

        expect(screen.getByText("stored1")).toBeInTheDocument();
        expect(screen.getByText("stored2")).toBeInTheDocument();

        fireEvent.click(screen.getByText("stored1"));

        expect(takeTestActions.setPasscode).toHaveBeenCalledWith({
            code: "stored1",
        });
    });

    it("should hide tabs if passCodeOnly is true", () => {
        render(
            <PasscodeLink
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                passCodeOnly={true}
            />
        );

        expect(screen.queryByText("Link")).not.toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Enter passcode")
        ).toBeInTheDocument();
    });

    it("should show loading state", () => {
        (useQuery as jest.Mock).mockReturnValue({
            isLoading: true,
            refetch: mockRefetch,
        });

        render(
            <PasscodeLink onClose={mockOnClose} onSuccess={mockOnSuccess} />
        );

        expect(screen.getByText("Validating...")).toBeInTheDocument();
        expect(screen.getByText("Validating...")).toBeDisabled();
    });
});
