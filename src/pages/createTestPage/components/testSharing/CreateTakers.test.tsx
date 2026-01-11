import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateTakers from "./CreateTakers";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/hooks";
import { createTestActions } from "../../../../stores/createTest";
import { toast } from "react-toastify";

jest.mock("../../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("../../../../services/test", () => ({
    createTakersForTest: jest.fn(),
}));

jest.mock("../../../../stores/createTest", () => ({
    createTestActions: {
        saveSelectedTestTakers: jest.fn(),
    },
}));

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

// Mock INITIAL_TAKER if it's not available in the test environment context
jest.mock("../../../../config/constants/initialValues", () => ({
    INITIAL_TAKER: { name: "", email: "" },
}));

describe("CreateTakers", () => {
    const mockOnClose = jest.fn();
    const mockMutate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
        });
        (useMutation as jest.Mock).mockImplementation((options) => ({
            mutate: jest.fn((data) => {
                mockMutate(data);
                if (options && options.onSuccess) {
                    options.onSuccess({ takers: data });
                }
            }),
            isLoading: false,
        }));
    });

    it("should render correctly", () => {
        render(<CreateTakers onClose={mockOnClose} />);

        expect(screen.getByTestId("modal")).toBeInTheDocument();
        expect(screen.getByTestId("modal-header")).toHaveTextContent(
            "Create takers"
        );
        expect(screen.getAllByTestId("mock-input")).toHaveLength(2); // Name and Email
        expect(screen.getByText("Add")).toBeInTheDocument();
        expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("should add a new taker row when Add button is clicked", () => {
        render(<CreateTakers onClose={mockOnClose} />);

        const addButton = screen.getByText("Add");
        fireEvent.click(addButton);

        expect(screen.getAllByTestId("mock-input")).toHaveLength(4); // 2 rows * 2 inputs
    });

    it("should update taker values on input change", () => {
        render(<CreateTakers onClose={mockOnClose} />);

        const inputs = screen.getAllByTestId("mock-input");
        const nameInput = inputs[0];
        const emailInput = inputs[1];

        fireEvent.change(nameInput, { target: { value: "John Doe" } });
        fireEvent.change(emailInput, { target: { value: "john@example.com" } });

        expect(nameInput).toHaveValue("John Doe");
        expect(emailInput).toHaveValue("john@example.com");
    });

    it("should call mutation and dispatch on save", async () => {
        render(<CreateTakers onClose={mockOnClose} />);

        const inputs = screen.getAllByTestId("mock-input");
        fireEvent.change(inputs[0], { target: { value: "John Doe" } });
        fireEvent.change(inputs[1], { target: { value: "john@example.com" } });

        const saveButton = screen.getByText("Save");
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith([
                { name: "John Doe", email: "john@example.com" },
            ]);
        });

        expect(createTestActions.saveSelectedTestTakers).toHaveBeenCalledWith([
            { name: "John Doe", email: "john@example.com" },
        ]);
        expect(useDispatch()).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });

    it("should show saving state", () => {
        (useMutation as jest.Mock).mockImplementation(() => ({
            mutate: jest.fn(),
            isLoading: true,
        }));

        render(<CreateTakers onClose={mockOnClose} />);

        expect(screen.getByText("Saving...")).toBeInTheDocument();
        expect(screen.getByText("Saving...")).toBeDisabled();
    });
});
