import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Option from "./Option";
import React from "react";

// Mock Input component
jest.mock("../../../../components/elements/Input", () => {
    const React = require("react");
    return React.forwardRef(({ error, ...props }: any, ref: any) => (
        <div data-testid="mock-input-wrapper">
            <input ref={ref} {...props} />
            {error && <span data-testid="input-error">{error}</span>}
        </div>
    ));
});

describe("Option Component", () => {
    const defaultProps = {
        index: 0,
        name: "option-0",
        onChange: jest.fn(),
    };

    it("should render label correctly based on index", () => {
        render(<Option {...defaultProps} />);
        expect(screen.getByText("Option 1:")).toBeInTheDocument();
    });

    it("should render input with correct props", () => {
        render(<Option {...defaultProps} defaultValue="test value" />);
        const input = screen.getByRole("textbox");
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("name", "option-0");
        expect(input).toHaveValue("test value");
    });

    it("should show delete button on hover", async () => {
        const user = userEvent.setup();
        render(<Option {...defaultProps} onDelete={jest.fn()} />);

        const container = screen.getByTestId("option-item");

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();

        await user.hover(container);
        expect(screen.getByText("Delete")).toBeInTheDocument();

        await user.unhover(container);
        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    });

    it("should call onDelete with index when delete button is clicked", async () => {
        const onDeleteMock = jest.fn();
        const user = userEvent.setup();
        render(<Option {...defaultProps} index={2} onDelete={onDeleteMock} />);

        const container = screen.getByTestId("option-item");

        await user.hover(container);

        const deleteBtn = screen.getByText("Delete");
        expect(deleteBtn).toBeInTheDocument();
        fireEvent.click(deleteBtn);
        expect(onDeleteMock).toHaveBeenCalledWith(2);
    });

    it("should pass error prop to Input", () => {
        render(<Option {...defaultProps} error="Test error" />);
        expect(screen.getByTestId("input-error")).toHaveTextContent(
            "Test error"
        );
    });

    it("should forward ref to input", () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<Option {...defaultProps} ref={ref} />);

        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
});
