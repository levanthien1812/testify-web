import { act, render, screen, waitFor } from "@testing-library/react";
import Part from "./Part";
import { useAppSelector } from "../../../../hooks/hooks";
import { useMutation } from "react-query";
import { createTestActions } from "../../../../stores/createTest";
import { addPart, updatePart, movePart } from "../../../../services/test";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";

jest.mock("../../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("../../../../services/test", () => ({
    addPart: jest.fn(),
    updatePart: jest.fn(),
    movePart: jest.fn(),
}));

jest.mock("../../../../stores/createTest", () => ({
    createTestActions: {
        saveTestParts: jest.fn(),
        validate: jest.fn(),
        movePart: jest.fn(),
    },
}));

jest.mock("../../../../config/constants/initialValues", () => ({
    __esModule: true,
    INITIAL_PART: { name: "", description: "", score: 0, num_questions: 0 },
}));

jest.mock("../../../../components/accordions/Accordion", () => ({
    __esModule: true,
    default: ({ children, viewData }: any) => (
        <div data-testid="accordion">
            <div data-testid="accordion-title">{viewData.title.text}</div>
            <div data-testid="accordion-actions">
                {viewData.actions?.map(
                    (action: any, index: number) =>
                        action.display !== false && (
                            <button
                                key={index}
                                onClick={action.onClick}
                                disabled={action.disabled}
                            >
                                {action.text}
                            </button>
                        )
                )}
            </div>
            {children}
        </div>
    ),
}));

jest.mock("../../../../components/elements/Input", () => {
    const React = require("react");
    return {
        __esModule: true,
        default: React.forwardRef(({ label, ...props }: any, ref: any) => (
            <label>
                {label?.text}
                <input ref={ref} {...props} />
            </label>
        )),
    };
});

jest.mock("../../../../components/elements/Button", () => ({
    __esModule: true,
    default: ({ children, secondary, ...props }: any) => (
        <button {...props}>{children}</button>
    ),
}));

describe("Part", () => {
    const mockAddPart = jest.fn();
    const mockUpdatePart = jest.fn();
    const mockMovePart = jest.fn();

    const defaultState = {
        testId: "test-123",
        maxScore: 100,
        editibility: {
            TEST_PARTS: {
                name: true,
                description: true,
                score: true,
                num_questions: true,
            },
        },
        numParts: 2,
        openAllParts: true,
    };

    const defaultPart = {
        id: "part-1",
        order: 1,
        name: "Part 1",
        description: "Description 1",
        score: 50,
        num_questions: 5,
        is_saved: true,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppSelector as unknown as jest.Mock).mockReturnValue(defaultState);
        (addPart as jest.Mock).mockImplementation(mockAddPart);
        (updatePart as jest.Mock).mockImplementation(mockUpdatePart);
        (movePart as jest.Mock).mockImplementation(mockMovePart);

        (useMutation as jest.Mock).mockImplementation((options) => ({
            mutate: jest.fn((data) => {
                // Simulate calling the mutation function
                if (options.mutationFn) {
                    options.mutationFn(data);
                }
                // Simulate success
                if (options.onSuccess) {
                    // For create/update part, we expect a response with 'part'
                    // For move part, the response structure matters less for the test logic provided
                    options.onSuccess({ part: { ...defaultPart, ...data } });
                }
            }),
            isLoading: false,
        }));
    });

    it("should render part details correctly", () => {
        render(<Part part={defaultPart} />);
        expect(screen.getByLabelText("Name")).toHaveValue("Part 1");
        expect(screen.getByLabelText("Description")).toHaveValue(
            "Description 1"
        );
        expect(screen.getByLabelText("Score")).toHaveValue(50);
        expect(screen.getByLabelText("Number of questions")).toHaveValue(5);
        expect(screen.getByText("Part 1")).toBeInTheDocument(); // Accordion title
    });

    it("should enable editing when Edit button is clicked", async () => {
        const user = userEvent.setup();
        render(<Part part={defaultPart} />);

        const editButton = screen.getByText("Edit");
        await user.click(editButton);

        expect(screen.getByText("Save")).toBeInTheDocument();
        expect(screen.getByText("Cancel")).toBeInTheDocument();
        expect(screen.getByLabelText("Name")).toBeEnabled();
    });

    it("should call updatePart mutation on save when editing existing part", async () => {
        const user = userEvent.setup();
        render(<Part part={defaultPart} />);

        await user.click(screen.getByText("Edit"));

        const nameInput = screen.getByLabelText("Name");
        await user.clear(nameInput);
        await user.type(nameInput, "Updated Part 1");

        await user.click(screen.getByText("Save"));

        await waitFor(() => {
            expect(mockUpdatePart).toHaveBeenCalledWith(
                "test-123",
                "part-1",
                expect.objectContaining({ name: "Updated Part 1" })
            );
        });
        expect(createTestActions.saveTestParts).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalled();
    });

    it("should call addPart mutation on save when creating new part", async () => {
        const newPart = {
            order: 3,
            name: "",
            description: "",
            score: 0,
            num_questions: 0,
        };
        const user = userEvent.setup();

        render(<Part part={newPart} />);

        // New part starts in editing mode
        expect(screen.getByText("Save")).toBeInTheDocument();

        await user.type(screen.getByLabelText("Name"), "New Part");
        await user.type(screen.getByLabelText("Score"), "20");
        await user.type(screen.getByLabelText("Number of questions"), "2");

        await user.click(screen.getByText("Save"));

        await waitFor(() => {
            expect(mockAddPart).toHaveBeenCalledWith(
                "test-123",
                expect.objectContaining({
                    name: "New Part",
                    score: 20,
                    num_questions: 2,
                })
            );
        });
    });

    it("should handle move up action", async () => {
        const part2 = { ...defaultPart, id: "part-2", order: 2 };
        const user = userEvent.setup();
        render(<Part part={part2} />);

        const moveUpButton = screen.getByText("Move up");
        await user.click(moveUpButton);

        expect(createTestActions.movePart).toHaveBeenCalledWith({
            partId: "part-2",
            direction: "up",
        });
        expect(mockMovePart).toHaveBeenCalledWith("test-123", "part-2", "up");
    });

    it("should handle move down action", async () => {
        const user = userEvent.setup();
        render(<Part part={defaultPart} />); // order 1

        const moveDownButton = screen.getByText("Move down");
        await user.click(moveDownButton);

        expect(createTestActions.movePart).toHaveBeenCalledWith({
            partId: "part-1",
            direction: "down",
        });
        expect(mockMovePart).toHaveBeenCalledWith("test-123", "part-1", "down");
    });

    it("should disable move up button for first part", () => {
        render(<Part part={defaultPart} />); // order 1
        expect(screen.getByText("Move up")).toBeDisabled();
    });

    it("should disable move down button for last part", () => {
        const lastPart = { ...defaultPart, order: 2 }; // numParts is 2 in defaultState
        render(<Part part={lastPart} />);
        expect(screen.getByText("Move down")).toBeDisabled();
    });

    it("should reset form on cancel", async () => {
        const user = userEvent.setup();
        render(<Part part={defaultPart} />);

        await user.click(screen.getByText("Edit"));
        const nameInput = screen.getByLabelText("Name");
        await user.clear(nameInput);
        await user.type(nameInput, "Changed Name");

        await user.click(screen.getByText("Cancel"));

        expect(screen.getByLabelText("Name")).toHaveValue("Part 1");
        expect(screen.queryByText("Save")).not.toBeInTheDocument();
    });
});
