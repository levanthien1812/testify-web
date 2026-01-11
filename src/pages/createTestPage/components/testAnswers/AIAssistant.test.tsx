import { render, screen, fireEvent } from "@testing-library/react";
import AIAssistant from "./AIAssistant";

// Mock dependencies
jest.mock("../../../../components/modals/Modal", () => {
    const Modal = ({ children, onClose, width }: any) => (
        <div data-testid="modal" data-width={width}>
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
        ModalFooter: () => <div data-testid="modal-footer">Footer</div>,
    };
});

jest.mock(
    "../../../chatPage/components/selectedAIChat/AIInputMessage",
    () =>
        ({ initialMessage }: any) =>
            (
                <div
                    data-testid="ai-input-message"
                    data-initial-message={initialMessage}
                >
                    Input
                </div>
            )
);

jest.mock(
    "../../../chatPage/components/selectedAIChat/AIMessages",
    () => () => <div data-testid="ai-messages">Messages</div>
);

describe("AIAssistant", () => {
    const mockOnClose = jest.fn();
    const mockMessage = "Help me with this question";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render correctly", () => {
        render(<AIAssistant message={mockMessage} onClose={mockOnClose} />);

        expect(screen.getByTestId("modal")).toBeInTheDocument();
        expect(screen.getByTestId("modal-header")).toHaveTextContent(
            "AI Assistant"
        );
        expect(screen.getByTestId("modal-body")).toBeInTheDocument();
        expect(screen.getByTestId("modal-footer")).toBeInTheDocument();
        expect(screen.getByTestId("ai-messages")).toBeInTheDocument();
        expect(screen.getByTestId("ai-input-message")).toBeInTheDocument();
    });

    it("should pass initial message to AIInputMessage", () => {
        render(<AIAssistant message={mockMessage} onClose={mockOnClose} />);
        const inputMessage = screen.getByTestId("ai-input-message");
        expect(inputMessage).toHaveAttribute(
            "data-initial-message",
            mockMessage
        );
    });

    it("should call onClose when modal close is triggered", () => {
        render(<AIAssistant message={mockMessage} onClose={mockOnClose} />);
        fireEvent.click(screen.getByTestId("modal-close"));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should have correct width prop passed to Modal", () => {
        render(<AIAssistant message={mockMessage} onClose={mockOnClose} />);
        expect(screen.getByTestId("modal")).toHaveAttribute(
            "data-width",
            "md:w-1/2"
        );
    });
});
