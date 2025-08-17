import { BrowserRouter } from "react-router-dom";
import RegistePage from "./RegistePage";
import { fireEvent, screen } from "@testing-library/react";
import { useMutation } from "react-query";

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
const mockRegisterService = jest.fn();
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

jest.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
}));

jest.mock("../../services/auth.ts", () => ({
    registerService: () => mockRegisterService,
}));

jest.mock("react-toastify", () => ({
    toast: {
        success: () => mockToastSuccess,
        error: () => mockToastError,
    },
}));

jest.mock("react-query", () => ({
    useMutation: jest.fn,
}));

const renderComponent = () => {
    return (
        <BrowserRouter>
            <RegistePage />
        </BrowserRouter>
    );
};

describe("RegistePage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            isLoading: false,
        });
    });

    it("should render without crashing", () => {
        renderComponent();
        expect(screen.getByText("Register")).toBeInTheDocument();
    });

    it("shound renders all input fields and the submit button", () => {
        renderComponent();
        expect(screen.getByLabelText("Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Register" })
        ).toBeInTheDocument();
    });

    it("should navigate to login page when 'login' link is clicked", () => {
        renderComponent();
        const loginLink = screen.getByText("Login");
        fireEvent.click(loginLink);
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
});
