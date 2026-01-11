import { render, screen, fireEvent } from "@testing-library/react";
import TakersChoser from "./TakersChoser";
import { useQuery } from "react-query";

// Mocks
jest.mock("react-query", () => ({
    useQuery: jest.fn(),
}));

jest.mock("../../../../services/user", () => ({
    getTakerGroups: jest.fn(),
}));

jest.mock("../../../../components/elements/Input", () => (props: any) => (
    <input data-testid="mock-input" {...props} />
));

jest.mock("../../../../components/elements/Select", () => (props: any) => (
    <select data-testid="mock-select" {...props} onChange={props.onChange}>
        {props.options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
        ))}
    </select>
));

jest.mock("../../../../utils/text", () => ({
    shorten: (text: string) => text,
}));

const mockTakers = [
    {
        id: "t1",
        name: "Taker 1",
        user: { email: "taker1@example.com" },
        group_id: "g1",
        group: { id: "g1", name: "Group 1" },
    },
    {
        id: "t2",
        name: "Taker 2",
        user: { email: "taker2@example.com" },
        group_id: "g2",
        group: { id: "g2", name: "Group 2" },
    },
];

const mockGroups = [
    { id: "g1", name: "Group 1" },
    { id: "g2", name: "Group 2" },
];

describe("TakersChoser", () => {
    const mockOnCheck = jest.fn();
    const mockOnCheckAll = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useQuery as jest.Mock).mockReturnValue({
            data: mockGroups,
            isLoading: false,
        });
    });

    it("should render correctly", () => {
        render(
            <TakersChoser
                takers={mockTakers as any}
                selectedTestTakers={[]}
                onCheck={mockOnCheck}
                onCheckAll={mockOnCheckAll}
            />
        );

        expect(screen.getByText("Choose takers")).toBeInTheDocument();
        expect(screen.getByText("Select all")).toBeInTheDocument();
        expect(screen.getByTestId("mock-input")).toBeInTheDocument(); // Search
        expect(screen.getByTestId("mock-select")).toBeInTheDocument(); // Group select
        expect(screen.getByText("Taker 1")).toBeInTheDocument();
        expect(screen.getByText("Taker 2")).toBeInTheDocument();
    });

    it("should filter takers by search", () => {
        render(
            <TakersChoser
                takers={mockTakers as any}
                selectedTestTakers={[]}
                onCheck={mockOnCheck}
                onCheckAll={mockOnCheckAll}
            />
        );

        const searchInput = screen.getByTestId("mock-input");
        fireEvent.change(searchInput, { target: { value: "taker1" } });

        expect(screen.getByText("Taker 1")).toBeInTheDocument();
        expect(screen.queryByText("Taker 2")).not.toBeInTheDocument();
    });

    it("should filter takers by group", () => {
        render(
            <TakersChoser
                takers={mockTakers as any}
                selectedTestTakers={[]}
                onCheck={mockOnCheck}
                onCheckAll={mockOnCheckAll}
            />
        );

        const groupSelect = screen.getByTestId("mock-select");
        fireEvent.change(groupSelect, { target: { value: "g1" } });

        expect(screen.getByText("Taker 1")).toBeInTheDocument();
        expect(screen.queryByText("Taker 2")).not.toBeInTheDocument();
    });

    it("should handle select all", () => {
        render(
            <TakersChoser
                takers={mockTakers as any}
                selectedTestTakers={[]}
                onCheck={mockOnCheck}
                onCheckAll={mockOnCheckAll}
            />
        );

        const selectAllCheckbox = screen.getByLabelText("Select all");
        fireEvent.click(selectAllCheckbox);

        expect(mockOnCheckAll).toHaveBeenCalledWith(mockTakers, true);
    });

    it("should handle unselect all", () => {
        render(
            <TakersChoser
                takers={mockTakers as any}
                selectedTestTakers={mockTakers as any}
                onCheck={mockOnCheck}
                onCheckAll={mockOnCheckAll}
            />
        );

        // Initially checked because all takers are selected
        const selectAllCheckbox = screen.getByLabelText("Select all");
        expect(selectAllCheckbox).toBeChecked();

        fireEvent.click(selectAllCheckbox);

        expect(mockOnCheckAll).toHaveBeenCalledWith(mockTakers, false);
    });

    it("should handle individual taker selection", () => {
        const { container } = render(
            <TakersChoser
                takers={mockTakers as any}
                selectedTestTakers={[]}
                onCheck={mockOnCheck}
                onCheckAll={mockOnCheckAll}
            />
        );

        // Find checkbox for Taker 1. The input has id="t1" based on mock data
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const taker1Input = container.querySelector("#t1");
        fireEvent.click(taker1Input!);

        expect(mockOnCheck).toHaveBeenCalledWith(mockTakers[0], true);
    });

    it("should handle individual taker unselection", () => {
        const { container } = render(
            <TakersChoser
                takers={mockTakers as any}
                selectedTestTakers={[mockTakers[0] as any]}
                onCheck={mockOnCheck}
                onCheckAll={mockOnCheckAll}
            />
        );

        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const taker1Input = container.querySelector("#t1");
        expect(taker1Input).toBeChecked();

        fireEvent.click(taker1Input!);

        expect(mockOnCheck).toHaveBeenCalledWith(mockTakers[0], false);
    });

    it("should show no takers found message", () => {
        render(
            <TakersChoser
                takers={[]}
                selectedTestTakers={[]}
                onCheck={mockOnCheck}
                onCheckAll={mockOnCheckAll}
            />
        );

        expect(screen.getByText("No takers found!")).toBeInTheDocument();
    });

    it("should update select all checkbox when all takers are selected externally", () => {
        const { rerender } = render(
            <TakersChoser
                takers={mockTakers as any}
                selectedTestTakers={[]}
                onCheck={mockOnCheck}
                onCheckAll={mockOnCheckAll}
            />
        );

        const selectAllCheckbox = screen.getByLabelText("Select all");
        expect(selectAllCheckbox).not.toBeChecked();

        rerender(
            <TakersChoser
                takers={mockTakers as any}
                selectedTestTakers={mockTakers as any}
                onCheck={mockOnCheck}
                onCheckAll={mockOnCheckAll}
            />
        );

        expect(selectAllCheckbox).toBeChecked();
    });
});
