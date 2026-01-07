import "@testing-library/jest-dom";

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

// Mock react-redux
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
}));

// Mock react-toastify
jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        warning: jest.fn(),
        info: jest.fn(),
    },
}));

// Mock react-query
jest.mock("react-query", () => ({
    useMutation: jest.fn(),
    useQuery: jest.fn(),
}));

// Mock constants (adjust path if necessary, relative to this file)
jest.mock(
    "./config/constants/errorCode",
    () => ({
        ERROR_CODE: {
            EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
        },
    }),
    { virtual: true }
);

// Global setup for Modal (used by RegisterPage and potentially others)
beforeAll(() => {
    const modalRoot = document.createElement("div");
    modalRoot.id = "modal";
    document.body.appendChild(modalRoot);
});

afterAll(() => {
    const modalRoot = document.getElementById("modal");
    if (modalRoot) {
        modalRoot.remove();
    }
});

// Clear mocks before each test to ensure isolation
beforeEach(() => {
    jest.clearAllMocks();
});
