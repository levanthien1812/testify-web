import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import ResetPassword from "./ResetPassword";

// Mock the service to prevent loading the real file and its dependencies (like axios)
const mockResetPasswordService = jest.fn();
jest.mock("../../services/auth", () => ({
    resetPassword: () => mockResetPasswordService,
}));

const renderComponent = (searchParams: string) => {
    return render(
        <MemoryRouter initialEntries={[`/reset-password?${searchParams}`]}>
            <ResetPassword />
        </MemoryRouter>
    );
};

describe("ResetPassword", () => {
    beforeEach(() => {
        // Provide a default mock for useMutation for all tests
        (useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isLoading: false,
        });
    });

    it("should render the form correctly when params are present", () => {
        renderComponent("email=test@example.com&token=12345");
        expect(
            screen.getByRole("heading", { name: /reset your password/i })
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(
            screen.getByLabelText(/^Password(?! confirmation)/i)
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText(/password confirmation/i)
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Reset password" })
        ).toBeInTheDocument();
    });

    it("should pre-fill email from URL and disable the field", () => {
        renderComponent("email=test@example.com&token=12345");
        const emailInput = screen.getByLabelText(/email/i);
        expect(emailInput).toHaveValue("test@example.com");
        expect(emailInput).toBeDisabled();
    });

    it("should show warning and navigate to login if params are missing", async () => {
        renderComponent(""); // No params
        await waitFor(() => {
            expect(toast.warning).toHaveBeenCalledWith(
                "Email or token not found! Please try again."
            );
        });
        expect(useNavigate()).toHaveBeenCalledWith("/login");
    });

    it("should display validation errors for empty password fields", async () => {
        const user = userEvent.setup();
        renderComponent("email=test@example.com&token=12345");

        const submitButton = screen.getByRole("button", {
            name: "Reset password",
        });
        await user.click(submitButton);

        expect(
            await screen.findByText("Password is required")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Password confirmation is required")
        ).toBeInTheDocument();
    });

    it("should show loading state when submitting", () => {
        (useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isLoading: true,
        });
        renderComponent("email=test@example.com&token=12345");
        const submitButton = screen.getByRole("button", {
            name: /resetting password/i,
        });
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
    });

    it("should call mutation, show success toast, and navigate on valid submission", async () => {
        const user = userEvent.setup();
        const mockMutate = jest.fn();
        (useMutation as jest.Mock).mockImplementation((options) => ({
            mutate: (variables: any) => {
                mockMutate(variables);
                options.onSuccess();
            },
            isLoading: false,
        }));

        renderComponent("email=test@example.com&token=12345");

        await user.type(
            screen.getByLabelText(/^Password(?! confirmation)/i),
            "newpassword123"
        );
        await user.type(
            screen.getByLabelText(/password confirmation/i),
            "newpassword123"
        );

        const submitButton = screen.getByRole("button", {
            name: "Reset password",
        });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith({
                email: "test@example.com",
                token: "12345",
                password: "newpassword123",
                password_confirm: "newpassword123",
            });
        });

        expect(toast.success).toHaveBeenCalledWith(
            "Password reset successfully"
        );
        expect(useNavigate()).toHaveBeenCalledWith("/login");
    });
});
