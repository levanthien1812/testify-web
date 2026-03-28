import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
    it("should render correctly with children", () => {
        render(<Button>Click me</Button>);
        expect(
            screen.getByRole("button", { name: "Click me" })
        ).toBeInTheDocument();
    });

    it("should handle click events", () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        fireEvent.click(screen.getByText("Click me"));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should render primary variant by default", () => {
        render(<Button>Primary</Button>);
        const button = screen.getByRole("button");
        expect(button).toHaveClass("bg-orange-600");
        expect(button).toHaveClass("text-white");
    });

    it("should render secondary variant", () => {
        render(<Button secondary>Secondary</Button>);
        const button = screen.getByRole("button");
        expect(button).toHaveClass("bg-gray-200");
        expect(button).toHaveClass("text-gray-500");
    });

    it("should render outlined variant", () => {
        render(<Button outlined>Outlined</Button>);
        const button = screen.getByRole("button");
        expect(button).toHaveClass("border-orange-600");
        expect(button).toHaveClass("bg-white");
        expect(button).toHaveClass("text-orange-600");
    });

    it("should render link variant", () => {
        render(<Button link>Link</Button>);
        const button = screen.getByRole("button");
        expect(button).toHaveClass("hover:underline");
        expect(button).toHaveClass("text-orange-600");
    });

    it("should apply size classes", () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        let button = screen.getByRole("button");
        expect(button).toHaveClass("px-4 py-0.5 text-sm");

        rerender(<Button size="md">Medium</Button>);
        button = screen.getByRole("button");
        expect(button).toHaveClass("sm:px-8");

        rerender(<Button size="lg">Large</Button>);
        button = screen.getByRole("button");
        expect(button).toHaveClass("sm:px-12");
    });

    it("should apply custom className", () => {
        render(<Button className="custom-class">Custom</Button>);
        expect(screen.getByRole("button")).toHaveClass("custom-class");
    });

    it("should be disabled when disabled prop is true", () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
        expect(button).toHaveClass("disabled:bg-gray-300");
    });

    it("should set type attribute", () => {
        render(<Button type="submit">Submit</Button>);
        expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });
});
