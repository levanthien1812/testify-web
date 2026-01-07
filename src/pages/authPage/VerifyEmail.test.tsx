import { render, screen, waitFor, act } from "@testing-library/react";
import VerifyEmail from "./VerifyEmail";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

// Mock services
const mockVerifyEmailService = jest.fn();
const mockSendVerificationCodeService = jest.fn();

jest.mock("../../services/auth", () => ({
    verifyEmail: () => mockVerifyEmailService,
    sendVerificationCode: () => mockSendVerificationCodeService,
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

const renderComponent = (state: any = { email: "test@example.com" }) => {
    return render(
        <MemoryRouter initialEntries={[{ pathname: "/verify-email", state }]}>
            <Routes>
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/register" element={<h1>Register Page</h1>} />
            </Routes>
        </MemoryRouter>
    );
};

describe("VerifyEmail", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default mock for useMutation
        (useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isLoading: false,
        });
    });

    it("should render correctly with email from state", () => {
        renderComponent();
        expect(
            screen.getByRole("heading", { name: /verify your email/i })
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toHaveValue("test@example.com");
        expect(screen.getByLabelText(/code/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Verify" })
        ).toBeInTheDocument();
    });

    it("should redirect to register if email is missing in state", () => {
        renderComponent(null);
        expect(toast.warning).toHaveBeenCalledWith(
            "Email not found! Please register first."
        );
        expect(mockNavigate).toHaveBeenCalledWith("register");
    });

    it("should show validation error if code is empty", async () => {
        const user = userEvent.setup();
        renderComponent();

        const verifyBtn = screen.getByRole("button", { name: "Verify" });
        await user.click(verifyBtn);

        expect(await screen.findByText("Code is required")).toBeInTheDocument();
    });

    it("should call verifyEmail mutation on valid submission", async () => {
        const user = userEvent.setup();
        const mockMutate = jest.fn();

        (useMutation as jest.Mock).mockImplementation((options) => {
            if (
                options.mutationKey &&
                options.mutationKey[0] === "verify-email"
            ) {
                return {
                    mutate: (data: any) => {
                        mockMutate(data);
                        options.onSuccess();
                    },
                    isLoading: false,
                };
            }
            return { mutate: jest.fn(), isLoading: false };
        });

        renderComponent();
        const codeInput = screen.getByLabelText(/code/i);
        await user.type(codeInput, "123456");

        const verifyBtn = screen.getByRole("button", { name: "Verify" });
        await user.click(verifyBtn);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith({
                email: "test@example.com",
                code: "123456",
            });
        });

        expect(toast.success).toHaveBeenCalledWith(
            "Email verified successfully"
        );
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it("should handle resend code flow", async () => {
        jest.useFakeTimers();
        const user = userEvent.setup({
            advanceTimers: jest.advanceTimersByTime,
        });
        const mockMutate = jest.fn();

        (useMutation as jest.Mock).mockImplementation((options) => {
            if (
                options.mutationKey &&
                options.mutationKey[0] === "send-verification-code"
            ) {
                return {
                    mutate: (data: any) => {
                        mockMutate(data);
                        options.onSuccess();
                    },
                    isLoading: false,
                };
            }
            // Return default for verify-email so it doesn't crash
            return { mutate: jest.fn(), isLoading: false };
        });

        renderComponent();

        // Initially button is disabled because timer starts at 60
        const resendBtn = screen.getByRole("button", { name: /resend code/i });
        expect(resendBtn).toBeDisabled();
        expect(screen.getByText("60s")).toBeInTheDocument();

        // Advance timer to expire
        act(() => {
            jest.advanceTimersByTime(61000);
        });

        expect(resendBtn).toBeEnabled();
        expect(screen.queryByText(/s$/)).not.toBeInTheDocument();

        await user.click(resendBtn);

        expect(mockMutate).toHaveBeenCalledWith({ email: "test@example.com" });
        expect(toast.success).toHaveBeenCalledWith(
            "Send verification code successfully"
        );

        // Timer should restart
        expect(screen.getByText("60s")).toBeInTheDocument();

        jest.useRealTimers();
    });
});
