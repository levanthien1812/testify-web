import { fireEvent, render, screen } from "@testing-library/react";
import DraggableItem from "./DraggableItem";

describe("DraggableItem", () => {
    const mockItem = { id: "1", text: "Item 1" };
    const mockOnDrop = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render item text", () => {
        render(
            <DraggableItem
                item={mockItem}
                onDrop={mockOnDrop}
                part="left"
                draggable={true}
            />
        );
        expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    it("should have correct classes when draggable", () => {
        render(
            <DraggableItem
                item={mockItem}
                onDrop={mockOnDrop}
                part="left"
                draggable={true}
            />
        );
        const element = screen.getByText("Item 1");
        expect(element).toHaveClass("bg-gray-100 cursor-pointer");
        expect(element).toHaveAttribute("draggable", "true");
    });

    it("should have correct classes when not draggable", () => {
        render(
            <DraggableItem
                item={mockItem}
                onDrop={mockOnDrop}
                part="left"
                draggable={false}
            />
        );
        const element = screen.getByText("Item 1");
        expect(element).toHaveClass("bg-orange-200 cursor-not-allowed");
        expect(element).toHaveAttribute("draggable", "false");
    });

    it("should handle drag start", () => {
        render(
            <DraggableItem
                item={mockItem}
                onDrop={mockOnDrop}
                part="left"
                draggable={true}
            />
        );
        const element = screen.getByText("Item 1");
        const dataTransfer = {
            setData: jest.fn(),
        };
        fireEvent.dragStart(element, { dataTransfer });
        expect(dataTransfer.setData).toHaveBeenCalledWith("source_text", "1");
        expect(dataTransfer.setData).toHaveBeenCalledWith(
            "source_part",
            "left"
        );
        // Check if border class is applied (dragStart state)
        expect(element).toHaveClass("border border-orange-600");
    });

    it("should handle drag over", () => {
        render(
            <DraggableItem
                item={mockItem}
                onDrop={mockOnDrop}
                part="left"
                draggable={true}
            />
        );
        const element = screen.getByText("Item 1");
        fireEvent.dragOver(element);
        // Check if border class is applied (dragOver state)
        expect(element).toHaveClass("border border-orange-600");
    });

    it("should handle drop from right to left", () => {
        render(
            <DraggableItem
                item={mockItem}
                onDrop={mockOnDrop}
                part="left"
                draggable={true}
            />
        );
        const element = screen.getByText("Item 1");
        const dataTransfer = {
            getData: jest.fn((key) => {
                if (key === "source_text") return "2";
                if (key === "source_part") return "right";
                return "";
            }),
        };
        fireEvent.drop(element, { dataTransfer });
        expect(mockOnDrop).toHaveBeenCalledWith({ left: "1", right: "2" });
        // Check if border class is removed
        expect(element).not.toHaveClass("border border-orange-600");
    });

    it("should handle drop from left to right", () => {
        render(
            <DraggableItem
                item={mockItem}
                onDrop={mockOnDrop}
                part="right"
                draggable={true}
            />
        );
        const element = screen.getByText("Item 1");
        const dataTransfer = {
            getData: jest.fn((key) => {
                if (key === "source_text") return "2";
                if (key === "source_part") return "left";
                return "";
            }),
        };
        fireEvent.drop(element, { dataTransfer });
        expect(mockOnDrop).toHaveBeenCalledWith({ left: "2", right: "1" });
    });

    it("should not call onDrop if parts are same", () => {
        render(
            <DraggableItem
                item={mockItem}
                onDrop={mockOnDrop}
                part="left"
                draggable={true}
            />
        );
        const element = screen.getByText("Item 1");
        const dataTransfer = {
            getData: jest.fn((key) => {
                if (key === "source_text") return "2";
                if (key === "source_part") return "left";
                return "";
            }),
        };
        fireEvent.drop(element, { dataTransfer });
        expect(mockOnDrop).not.toHaveBeenCalled();
    });
});
