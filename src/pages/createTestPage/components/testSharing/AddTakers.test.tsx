import { render, screen, fireEvent } from "@testing-library/react";
import AddTakers from "./AddTakers";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/hooks";
import { createTestActions } from "../../../../stores/createTest";

jest.mock("../../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("../../../../services/test", () => ({
    getAvailableTakers: jest.fn(),
}));

jest.mock("../../../../stores/createTest", () => ({
    createTestActions: {
        setAvailableTakers: jest.fn((data) => ({
            type: "SET_AVAILABLE_TAKERS",
            payload: data,
        })),
        saveSelectedTestTakers: jest.fn((data) => ({
            type: "SAVE_SELECTED_TAKERS",
            payload: data,
        })),
        validate: jest.fn(() => ({ type: "VALIDATE" })),
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

jest.mock("./CreateTakers", () => ({ onClose }: any) => (
    <div data-testid="create-takers">
        Create Takers Component
        <button onClick={onClose} data-testid="close-create-takers">
            Close Create
        </button>
    </div>
));

jest.mock(
    "./TakersChoser",
    () =>
        ({ onCheck, onCheckAll, selectedTestTakers }: any) =>
            (
                <div data-testid="takers-choser">
                    Takers Choser
                    <div data-testid="selected-count">
                        {selectedTestTakers.length}
                    </div>
                    <button
                        onClick={() =>
                            onCheck({ id: "t1", name: "Taker 1" }, true)
                        }
                        data-testid="check-taker"
                    >
                        Check Taker
                    </button>
                    <button
                        onClick={() =>
                            onCheck({ id: "t1", name: "Taker 1" }, false)
                        }
                        data-testid="uncheck-taker"
                    >
                        Uncheck Taker
                    </button>
                    <button
                        onClick={() =>
                            onCheckAll(
                                [
                                    { id: "t1", name: "Taker 1" },
                                    { id: "t2", name: "Taker 2" },
                                ],
                                true
                            )
                        }
                        data-testid="check-all"
                    >
                        Check All
                    </button>
                </div>
            )
);

jest.mock(
    "../../../../components/elements/Button",
    () =>
        ({ children, onClick }: any) =>
            <button onClick={onClick}>{children}</button>
);

jest.mock(
    "../../../../components/loadings/Loading",
    () =>
        ({ isLoading }: any) =>
            isLoading ? <div data-testid="loading">Loading...</div> : null
);

describe("AddTakers", () => {
    const mockOnClose = jest.fn();
    const mockAvailableTakers = [
        { id: "t1", name: "Taker 1" },
        { id: "t2", name: "Taker 2" },
    ];
    const mockSelectedTakers = [{ id: "t3", name: "Taker 3" }]; // Initially selected

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
            availableTakers: mockAvailableTakers,
            selectedTestTakers: mockSelectedTakers,
        });
        (useQuery as jest.Mock).mockImplementation((options) => {
            if (options && options.onSuccess) {
                options.onSuccess(mockAvailableTakers);
            }
            return { isFetching: false, data: mockAvailableTakers };
        });
    });

    it("should render correctly", () => {
        render(<AddTakers onClose={mockOnClose} />);
        expect(screen.getByTestId("modal")).toBeInTheDocument();
        expect(screen.getByTestId("takers-choser")).toBeInTheDocument();
        expect(screen.getByText("Create new takers")).toBeInTheDocument();
        expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("should show loading state", () => {
        (useQuery as jest.Mock).mockReturnValue({ isFetching: true });
        render(<AddTakers onClose={mockOnClose} />);
        expect(screen.getByTestId("loading")).toBeInTheDocument();
        expect(screen.queryByTestId("takers-choser")).not.toBeInTheDocument();
    });

    it("should switch to CreateTakers view", () => {
        render(<AddTakers onClose={mockOnClose} />);
        fireEvent.click(screen.getByText("Create new takers"));
        expect(screen.getByTestId("create-takers")).toBeInTheDocument();
        expect(screen.queryByTestId("takers-choser")).not.toBeInTheDocument();
    });

    it("should close CreateTakers view", () => {
        render(<AddTakers onClose={mockOnClose} />);
        fireEvent.click(screen.getByText("Create new takers"));
        fireEvent.click(screen.getByTestId("close-create-takers"));
        expect(screen.queryByTestId("create-takers")).not.toBeInTheDocument();
        expect(screen.getByTestId("takers-choser")).toBeInTheDocument();
    });

    it("should handle saving takers", () => {
        render(<AddTakers onClose={mockOnClose} />);
        fireEvent.click(screen.getByText("Save"));
        expect(createTestActions.saveSelectedTestTakers).toHaveBeenCalledWith(
            mockSelectedTakers
        );
        expect(createTestActions.validate).toHaveBeenCalled();
        expect(useDispatch()).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });

    it("should handle checking a taker", () => {
        render(<AddTakers onClose={mockOnClose} />);

        // Initial count from mockSelectedTakers is 1
        expect(screen.getByTestId("selected-count")).toHaveTextContent("1");

        // Simulate checking a taker via the mock button in TakersChoser
        fireEvent.click(screen.getByTestId("check-taker"));

        // Initial: 1. Add "t1": 2.
        expect(screen.getByTestId("selected-count")).toHaveTextContent("2");
    });

    it("should handle unchecking a taker", () => {
        // Setup initial state with t1 selected so we can uncheck it
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
            availableTakers: mockAvailableTakers,
            selectedTestTakers: [{ id: "t1", name: "Taker 1" }],
        });

        render(<AddTakers onClose={mockOnClose} />);
        expect(screen.getByTestId("selected-count")).toHaveTextContent("1");

        fireEvent.click(screen.getByTestId("uncheck-taker"));
        expect(screen.getByTestId("selected-count")).toHaveTextContent("0");
    });

    it("should handle checking all takers", () => {
        render(<AddTakers onClose={mockOnClose} />);
        // Initial 1 (t3). Add 2 more (t1, t2). Total 3.
        fireEvent.click(screen.getByTestId("check-all"));
        expect(screen.getByTestId("selected-count")).toHaveTextContent("3");
    });
});
