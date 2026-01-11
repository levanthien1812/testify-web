import { render, screen, fireEvent } from "@testing-library/react";
import Takers from "./Takers";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/hooks";
import { createTestActions } from "../../../../stores/createTest";

// Mocks
jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));

jest.mock("../../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("../../../../stores/createTest", () => ({
    createTestActions: {
        removeSelectedTestTakers: jest.fn((payload) => ({
            type: "REMOVE_TAKER",
            payload,
        })),
        setnotifyAssignment: jest.fn((payload) => ({
            type: "SET_NOTIFY",
            payload,
        })),
    },
}));

jest.mock("../../../../utils/text", () => ({
    shorten: (text: string) => text,
}));

jest.mock("./AddTakers", () => ({ onClose }: any) => (
    <div data-testid="add-takers-modal">
        Add Takers Modal
        <button onClick={onClose} data-testid="close-add-takers">
            Close
        </button>
    </div>
));

jest.mock(
    "../../../../components/elements/Button",
    () =>
        ({ children, onClick, className }: any) =>
            (
                <button onClick={onClick} className={className}>
                    {children}
                </button>
            )
);

jest.mock(
    "../../../../components/elements/Checkbox",
    () =>
        ({ label, defaultChecked, onChange }: any) =>
            (
                <label>
                    <input
                        type="checkbox"
                        defaultChecked={defaultChecked}
                        onChange={onChange}
                        data-testid="notify-checkbox"
                    />
                    {label.text}
                </label>
            )
);

jest.mock("../../../../components/modals/Tooltip", () => ({ content }: any) => (
    <div data-testid="tooltip">{content}</div>
));

// Mock FontAwesomeIcon
jest.mock("@fortawesome/react-fontawesome", () => ({
    FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

// Mock faTimes
jest.mock("@fortawesome/free-solid-svg-icons", () => ({
    faTimes: "fa-times",
}));

const mockTakers = [
    {
        id: "t1",
        name: "Taker 1",
        user: { email: "taker1@example.com" },
        group: { name: "Group A" },
    },
    {
        id: "t2",
        name: "Taker 2",
        user: { email: "taker2@example.com" },
        // No group
    },
];

describe("Takers", () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    });

    it("should render list of selected takers", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            selectedTestTakers: mockTakers,
            notifyAssignment: false,
        });

        render(<Takers />);

        expect(screen.getByText("Taker 1")).toBeInTheDocument();
        expect(screen.getByText("- taker1@example.com")).toBeInTheDocument();
        expect(screen.getByText("Group A")).toBeInTheDocument();

        expect(screen.getByText("Taker 2")).toBeInTheDocument();
        expect(screen.getByText("- taker2@example.com")).toBeInTheDocument();
    });

    it("should handle removing a taker", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            selectedTestTakers: mockTakers,
            notifyAssignment: false,
        });

        render(<Takers />);

        // Find remove buttons (buttons containing the icon)
        const removeButtons = screen
            .getAllByRole("button")
            .filter((btn) => btn.querySelector('[data-testid="fa-icon"]'));

        fireEvent.click(removeButtons[0]);

        expect(createTestActions.removeSelectedTestTakers).toHaveBeenCalledWith(
            mockTakers[0]
        );
        expect(mockDispatch).toHaveBeenCalled();
    });

    it("should open AddTakers modal when Add button is clicked", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            selectedTestTakers: [],
            notifyAssignment: false,
        });

        render(<Takers />);

        expect(
            screen.queryByTestId("add-takers-modal")
        ).not.toBeInTheDocument();

        fireEvent.click(screen.getByText("Add"));

        expect(screen.getByTestId("add-takers-modal")).toBeInTheDocument();
    });

    it("should close AddTakers modal", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            selectedTestTakers: [],
            notifyAssignment: false,
        });

        render(<Takers />);

        fireEvent.click(screen.getByText("Add"));
        expect(screen.getByTestId("add-takers-modal")).toBeInTheDocument();

        fireEvent.click(screen.getByTestId("close-add-takers"));
        expect(
            screen.queryByTestId("add-takers-modal")
        ).not.toBeInTheDocument();
    });

    it("should handle notify assignment checkbox", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            selectedTestTakers: mockTakers,
            notifyAssignment: false,
        });

        render(<Takers />);

        const checkbox = screen.getByTestId("notify-checkbox");
        expect(checkbox).not.toBeChecked();

        fireEvent.click(checkbox);

        expect(createTestActions.setnotifyAssignment).toHaveBeenCalledWith(
            true
        );
        expect(mockDispatch).toHaveBeenCalled();
    });

    it("should not show notify checkbox if no takers selected", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            selectedTestTakers: [],
            notifyAssignment: false,
        });

        render(<Takers />);

        expect(screen.queryByTestId("notify-checkbox")).not.toBeInTheDocument();
    });
});
