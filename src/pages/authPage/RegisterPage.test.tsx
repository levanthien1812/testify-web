import { BrowserRouter, useNavigate } from "react-router-dom";
import RegisterPage from "./RegisterPage";
import { screen, render, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

const mockRegisterService = jest.fn();

jest.mock("../../services/auth", () => ({
    register: () => mockRegisterService,
}));

const renderComponent = () => {
    return render(
        <BrowserRouter>
            <RegisterPage />
        </BrowserRouter>
    );
};

describe("RegisterPage", () => {
    beforeEach(() => {
        (useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isLoading: false,
        });
    });

    it("should render without crashing", () => {
        renderComponent();
        expect(
            screen.getByRole("heading", { name: "Register" })
        ).toBeInTheDocument();
    });

    it("should render all input fields and the submit button", () => {
        renderComponent();
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        // Use a more specific regex to distinguish from "Password confirmation"
        expect(
            screen.getByLabelText(/^Password(?! confirmation)/i)
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText(/Password confirmation/i)
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Register" })
        ).toBeInTheDocument();
    });

    it("should have a link to login page", () => {
        renderComponent();
        const loginLink = screen.getByRole("link", { name: /login/i });
        expect(loginLink).toHaveAttribute("href", "/login");
    });

    it("should display validation errors when form is submitted with empty fields", async () => {
        const user = userEvent.setup();
        renderComponent();
        const registerButton = screen.getByRole("button", { name: "Register" });

        await user.click(registerButton);

        expect(await screen.findByText("Name is required")).toBeInTheDocument();
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(screen.getByText("Password is required")).toBeInTheDocument();
        expect(
            screen.getByText("Password confirmation is required")
        ).toBeInTheDocument();
    });

    it("should show loading state when submitting", () => {
        (useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isLoading: true,
        });

        renderComponent();

        const registerButton = screen.getByRole("button", {
            name: "Registering...",
        });
        expect(registerButton).toBeInTheDocument();
        expect(registerButton).toBeDisabled();
    });

    it("should call register mutation and show success modal on valid submission", async () => {
        const user = userEvent.setup();
        const mockMutate = jest.fn();
        (useMutation as jest.Mock).mockImplementation((options) => ({
            mutate: (variables: any) => {
                mockMutate(variables);
                // Simulate a successful mutation by calling the onSuccess callback
                act(() => {
                    options.onSuccess({ data: { message: "Success" } });
                });
            },
            isLoading: false,
        }));

        renderComponent();

        await user.type(screen.getByLabelText(/Name/i), "Test User");
        await user.type(screen.getByLabelText(/Email/i), "test@example.com");
        await user.type(
            screen.getByLabelText(/^Password(?! confirmation)/i),
            "password123"
        );
        await user.type(
            screen.getByLabelText(/Password confirmation/i),
            "password123"
        );

        const registerButton = screen.getByRole("button", { name: "Register" });
        await user.click(registerButton);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith({
                name: "Test User",
                email: "test@example.com",
                password: "password123",
                password_confirm: "password123",
            });
        });

        expect(toast.success).toHaveBeenCalledWith("Register successfully");
        expect(
            await screen.findByText(/Email Verification/i)
        ).toBeInTheDocument();

        const proceedButton = screen.getByRole("button", { name: "Proceed" });
        await user.click(proceedButton);

        expect(useNavigate()).toHaveBeenCalledWith("/verify-email", {
            state: { email: "test@example.com" },
        });
    });
});
