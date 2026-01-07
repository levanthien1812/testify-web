import { BrowserRouter, useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { authActions } from "../../stores/auth";
import { loginGoogle } from "../../services/auth";
import { useDispatch } from "react-redux";

const mockLoginService = jest.fn();

jest.mock("../../services/auth", () => ({
    login: () => mockLoginService,
    loginGoogle: jest.fn(),
}));

jest.mock("../../stores/auth", () => ({
    authActions: {
        authenticate: jest.fn(),
    },
}));

// Mock Google Login
jest.mock("@react-oauth/google", () => {
    const React = require("react");
    return {
        GoogleLogin: (props: any) =>
            React.createElement(
                "button",
                {
                    onClick: () =>
                        props.onSuccess({ credential: "mock_google_token" }),
                    "aria-label": "Sign in with Google",
                },
                "Sign in with Google"
            ),
    };
});

const renderComponent = () => {
    return render(
        <BrowserRouter>
            <LoginPage />
        </BrowserRouter>
    );
};

describe("LoginPage", () => {
    beforeEach(() => {
        (useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isLoading: false,
        });
    });

    it("should render without crashing", () => {
        renderComponent();
        expect(
            screen.getByRole("heading", { name: "Login" })
        ).toBeInTheDocument();
    });

    it("should render all input fields and the submit button", () => {
        renderComponent();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Login" })
        ).toBeInTheDocument();
    });

    it("should have links to register and forgot password pages", () => {
        renderComponent();
        const registerLink = screen.getByRole("link", { name: /register/i });
        expect(registerLink).toHaveAttribute("href", "/register");

        const forgotPasswordLink = screen.getByRole("link", {
            name: /forgot password/i,
        });
        expect(forgotPasswordLink).toHaveAttribute("href", "/forgot-password");
    });

    it("should display validation errors when form is submitted with empty fields", async () => {
        const user = userEvent.setup();
        renderComponent();
        const loginButton = screen.getByRole("button", { name: "Login" });

        await user.click(loginButton);

        expect(
            await screen.findByText("Email is required")
        ).toBeInTheDocument();
        expect(screen.getByText("Password is required")).toBeInTheDocument();
    });

    it("should show loading state when submitting", () => {
        (useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isLoading: true,
        });

        renderComponent();

        const loginButton = screen.getByRole("button", {
            name: "Logging in...",
        });
        expect(loginButton).toBeInTheDocument();
        expect(loginButton).toBeDisabled();
    });

    it("should call login mutation and dispatch action on valid submission", async () => {
        const user = userEvent.setup();
        const mockMutate = jest.fn();
        const mockUser = { id: 1, name: "Test User" };
        const mockTokens = { access: "token" };

        (useMutation as jest.Mock).mockImplementation((options) => ({
            mutate: (variables: any) => {
                mockMutate(variables);
                options.onSuccess({ user: mockUser, tokens: mockTokens });
            },
            isLoading: false,
        }));

        renderComponent();

        await user.type(screen.getByLabelText(/Email/i), "test@example.com");
        await user.type(screen.getByLabelText(/Password/i), "password123");

        const loginButton = screen.getByRole("button", { name: "Login" });
        await user.click(loginButton);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith({
                email: "test@example.com",
                password: "password123",
            });
        });

        expect(toast.success).toHaveBeenCalledWith("Login successfully");
        expect(authActions.authenticate).toHaveBeenCalledWith({
            user: mockUser,
            tokens: mockTokens,
        });
        expect(useDispatch()).toHaveBeenCalled();
    });

    it("should display error message on login failure", async () => {
        const user = userEvent.setup();
        const mockMutate = jest.fn();
        const errorMessage = "Invalid credentials";

        (useMutation as jest.Mock).mockImplementation((options) => ({
            mutate: (variables: any) => {
                mockMutate(variables);
                options.onError({
                    isAxiosError: true,
                    response: {
                        data: { message: errorMessage },
                    },
                });
            },
            isLoading: false,
        }));

        renderComponent();

        await user.type(screen.getByLabelText(/Email/i), "test@example.com");
        await user.type(screen.getByLabelText(/Password/i), "wrongpassword");

        const loginButton = screen.getByRole("button", { name: "Login" });
        await user.click(loginButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(errorMessage);
        });
    });

    it("should display email verification message when error code is EMAIL_NOT_VERIFIED", async () => {
        const user = userEvent.setup();
        const mockMutate = jest.fn();
        const errorMessage = "Email not verified";

        (useMutation as jest.Mock).mockImplementation((options) => ({
            mutate: (variables: any) => {
                mockMutate(variables);
                options.onError({
                    isAxiosError: true,
                    response: {
                        data: {
                            message: errorMessage,
                            errorCode: "EMAIL_NOT_VERIFIED",
                        },
                    },
                });
            },
            isLoading: false,
        }));

        renderComponent();

        await user.type(screen.getByLabelText(/Email/i), "test@example.com");
        await user.type(screen.getByLabelText(/Password/i), "password123");

        const loginButton = screen.getByRole("button", { name: "Login" });
        await user.click(loginButton);

        expect(
            await screen.findByText(/Your email is not verified/i)
        ).toBeInTheDocument();
        const verifyLink = screen.getByRole("link", { name: /here/i });
        expect(verifyLink).toHaveAttribute("href", "/send-verification-code");
    });

    it("should handle successful Google login", async () => {
        const user = userEvent.setup();
        const mockUser = { id: 1, name: "Google User" };
        const mockTokens = { access: "token" };

        (loginGoogle as jest.Mock).mockResolvedValue({
            status: 200,
            data: { user: mockUser, tokens: mockTokens },
        });

        renderComponent();

        const googleBtn = screen.getByRole("button", {
            name: /Sign in with Google/i,
        });
        await user.click(googleBtn);

        await waitFor(() => {
            expect(loginGoogle).toHaveBeenCalledWith("mock_google_token");
        });

        expect(authActions.authenticate).toHaveBeenCalledWith({
            user: mockUser,
            tokens: mockTokens,
        });
        expect(toast.success).toHaveBeenCalledWith(
            "Login successfuly. Welcome back to our app!"
        );
        expect(useNavigate()).toHaveBeenCalledWith("/");
    });

    it("should handle failed Google login API call", async () => {
        const user = userEvent.setup();
        const errorMessage = "Google login failed";

        (loginGoogle as jest.Mock).mockRejectedValue({
            isAxiosError: true,
            response: { data: { message: errorMessage } },
        });

        renderComponent();

        const googleBtn = screen.getByRole("button", {
            name: /Sign in with Google/i,
        });
        await user.click(googleBtn);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(errorMessage);
        });
    });
});
