import { render, screen, waitFor } from "@testing-library/react";
import SendVerificationCode from "./SendVerificationCode";
import { MemoryRouter, useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

// Mock the service
const mockSendVerificationCodeService = jest.fn();
jest.mock("../../services/auth", () => ({
    sendVerificationCode: () => mockSendVerificationCodeService,
}));

const renderComponent = (emailState?: string) => {
    const initialEntries = emailState
        ? [
              {
                  pathname: "/send-verification-code",
                  state: { email: emailState },
              },
          ]
        : ["/send-verification-code"];

    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <SendVerificationCode />
        </MemoryRouter>
    );
};

describe("SendVerificationCode", () => {
    beforeEach(() => {
        (useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isLoading: false,
        });
    });

    it("should render without crashing", () => {
        renderComponent();
        expect(
            screen.getByRole("heading", { name: /verify your email/i })
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /get verification code/i })
        ).toBeInTheDocument();
    });

    it("should pre-fill email from location state", () => {
        renderComponent("test@example.com");
        expect(screen.getByLabelText(/email/i)).toHaveValue("test@example.com");
    });

    it("should display validation error for empty email", async () => {
        const user = userEvent.setup();
        renderComponent();
        const submitButton = screen.getByRole("button", {
            name: /get verification code/i,
        });

        await user.click(submitButton);

        expect(
            await screen.findByText("Email is required")
        ).toBeInTheDocument();
    });

    it("should call mutation and navigate on valid submission", async () => {
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
        await user.type(emailInput, "new@example.com");

        const submitButton = screen.getByRole("button", {
            name: /get verification code/i,
        });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith({
                email: "new@example.com",
            });
        });

        expect(toast.success).toHaveBeenCalledWith(
            "Send verification code successfully"
        );
        expect(useNavigate()).toHaveBeenCalledWith("/verify-email", {
            state: { email: "new@example.com" },
        });
    });

    it("should show loading state", () => {
        (useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isLoading: true,
        });

        renderComponent();
        expect(
            screen.getByRole("button", { name: /sending email/i })
        ).toBeDisabled();
    });
});
