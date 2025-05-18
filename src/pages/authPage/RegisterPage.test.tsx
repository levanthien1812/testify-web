import { BrowserRouter } from "react-router-dom";
import RegistePage from "./RegistePage";
import { screen } from "@testing-library/react";
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
});
