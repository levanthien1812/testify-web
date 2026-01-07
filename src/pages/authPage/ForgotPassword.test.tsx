import { render, screen, waitFor } from "@testing-library/react";
import ForgotPassword from "./ForgotPassword";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { sendResetPasswordEmail } from "../../services/auth";
import { toast } from "react-toastify";
import { useMutation } from "react-query";

// Mock the service to prevent loading the real file (and axios)
const mockSendResetPasswordEmail = jest.fn();
jest.mock("../../services/auth", () => ({
    sendResetPasswordEmail: () => mockSendResetPasswordEmail,
}));

const renderComponent = (emailState?: string) => {
    const initialEntries = emailState
        ? [{ pathname: "/forgot-password", state: { email: emailState } }]
        : ["/forgot-password"];

    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <ForgotPassword />
        </MemoryRouter>
    );
};

describe("ForgotPassword", () => {
    beforeEach(() => {
        (useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isLoading: false,
        });
    });

    it("should render without crashing", () => {
        renderComponent();
        expect(
            screen.getByRole("heading", { name: /forgot password/i })
        ).toBeInTheDocument();
    });

    it("should render email input and submit button", () => {
        renderComponent();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /send/i })
        ).toBeInTheDocument();
    });

    it("should have a link back to login", () => {
        renderComponent();
        const loginLink = screen.getByRole("link", { name: /back to login/i });
        expect(loginLink).toHaveAttribute("href", "/login");
    });

    it("should pre-fill email from location state", () => {
        renderComponent("test@example.com");
        expect(screen.getByLabelText(/email/i)).toHaveValue("test@example.com");
    });

    it("should display validation error for empty email", async () => {
        const user = userEvent.setup();
        renderComponent();
        const submitButton = screen.getByRole("button", { name: /send/i });

        await user.click(submitButton);

        expect(
            await screen.findByText("Email is required")
        ).toBeInTheDocument();
    });

    it("should call mutation and show success message on valid submission", async () => {
        const user = userEvent.setup();
        const mockMutate = jest.fn();
        (useMutation as jest.Mock).mockImplementation((options) => ({
            mutate: (variables: any) => {
                mockMutate(variables);
                options.onSuccess();
            },
            isLoading: false,
        }));

        renderComponent();
        const emailInput = screen.getByLabelText(/email/i);
        await user.type(emailInput, "test@example.com");

        const submitButton = screen.getByRole("button", { name: /send/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith({
                email: "test@example.com",
            });
        });

        expect(toast.success).toHaveBeenCalledWith(
            "Send reset password email successfully"
        );
        expect(
            screen.getByText(
                /Check your email to find the reset password link/i
            )
        ).toBeInTheDocument();
    });

    it("should show loading state", () => {
        (useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isLoading: true,
        });

        renderComponent();
        expect(screen.getByRole("button", { name: /sending/i })).toBeDisabled();
    });
});
