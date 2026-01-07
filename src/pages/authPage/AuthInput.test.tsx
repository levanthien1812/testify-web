import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthInput from "./AuthInput";
import React from "react";

// Mock the Input component to isolate AuthInput logic
jest.mock("../../components/elements/Input", () => {
    const React = require("react");
    return React.forwardRef(({ error, ...props }: any, ref: any) => (
        <div data-testid="mock-input-wrapper">
            <input ref={ref} {...props} />
            {error && <span data-testid="input-error">{error}</span>}
        </div>
    ));
});

describe("AuthInput", () => {
    it("should render label and input correctly", () => {
        render(
            <AuthInput labelText="Username" name="username" id="username" />
        );

        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
        expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("should render required asterisk when required prop is true", () => {
        render(
            <AuthInput
                labelText="Username"
                name="username"
                id="username"
                required
            />
        );

        const asterisk = screen.getByText("*");
        expect(asterisk).toBeInTheDocument();
        expect(asterisk).toHaveClass("text-orange-600");
    });

    it("should display error message when error prop is provided", () => {
        const errorMessage = "This field is required";
        render(
            <AuthInput
                labelText="Username"
                name="username"
                id="username"
                error={errorMessage}
            />
        );

        expect(screen.getByTestId("input-error")).toHaveTextContent(
            errorMessage
        );
    });

    it("should toggle password visibility", async () => {
        const user = userEvent.setup();
        render(
            <AuthInput
                labelText="Password"
                name="password"
                id="password"
                type="password"
            />
        );

        const input = screen.getByLabelText(/Password/i);
        const showButton = screen.getByRole("button", { name: /SHOW/i });

        // Initially type should be password
        expect(input).toHaveAttribute("type", "password");

        // Click SHOW
        await user.click(showButton);
        expect(input).toHaveAttribute("type", "text");
        expect(
            screen.getByRole("button", { name: /HIDE/i })
        ).toBeInTheDocument();

        // Click HIDE
        await user.click(screen.getByRole("button", { name: /HIDE/i }));
        expect(input).toHaveAttribute("type", "password");
    });

    it("should not render toggle button for non-password inputs", () => {
        render(
            <AuthInput labelText="Email" name="email" id="email" type="email" />
        );

        expect(
            screen.queryByRole("button", { name: /SHOW/i })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /HIDE/i })
        ).not.toBeInTheDocument();
    });

    it("should forward ref to the input element", () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<AuthInput labelText="Test" name="test" id="test" ref={ref} />);

        expect(ref.current).toBeInstanceOf(HTMLInputElement);
        expect(ref.current).toHaveAttribute("name", "test");
    });
});
