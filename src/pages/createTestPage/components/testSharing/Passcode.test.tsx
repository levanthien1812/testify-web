import { render, screen, fireEvent } from "@testing-library/react";
import Passcode from "./Passcode";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/hooks";
import { createTestActions } from "../../../../stores/createTest";
import { useMutation } from "react-query";
import {
    PASSCODE_METHOD,
    PASSCODE_FORMAT,
} from "../../../../config/constants/passcode";
import { PASSCODE_VALID_UNIT } from "../../../../config/constants/tests";

// Mocks
jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));

jest.mock("../../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("react-query", () => ({
    useMutation: jest.fn(),
}));

jest.mock("../../../../services/test", () => ({
    generatePasscode: jest.fn(),
}));

jest.mock("../../../../stores/createTest", () => ({
    createTestActions: {
        setPasscode: jest.fn((payload) => ({ type: "SET_PASSCODE", payload })),
        validate: jest.fn(() => ({ type: "VALIDATE" })),
    },
}));

// Mock UI components
jest.mock("../../../../components/elements/Select", () => (props: any) => (
    <select
        data-testid={`select-${props.name}`}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
    >
        {props.options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
        ))}
    </select>
));

jest.mock("../../../../components/elements/Input", () => (props: any) => (
    <input
        data-testid={`input-${props.name}`}
        name={props.name}
        type={props.type}
        value={props.value}
        onChange={props.onChange}
    />
));

jest.mock(
    "../../../../components/elements/Button",
    () =>
        ({ children, onClick, disabled }: any) =>
            (
                <button onClick={onClick} disabled={disabled}>
                    {children}
                </button>
            )
);

describe("Passcode", () => {
    const mockDispatch = jest.fn();

    const initialPasscodeState = {
        method: "",
        format: PASSCODE_FORMAT["XXX-YYY"],
        code: "",
        valid_in: 30,
        valid_unit: PASSCODE_VALID_UNIT.MINUTES,
        valid_till: new Date("2024-01-01T10:00:00").toISOString(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        (useAppSelector as unknown as jest.Mock).mockImplementation(
            (selector) =>
                selector({
                    createTest: {
                        testId: "test-123",
                        passcode: initialPasscodeState,
                    },
                })
        );
        (useMutation as jest.Mock).mockImplementation((options) => ({
            mutate: jest.fn(() => {
                if (options && options.onSuccess) {
                    options.onSuccess("123456");
                }
            }),
            isLoading: false,
        }));
    });

    it("should render initial state correctly", () => {
        render(<Passcode />);
        expect(screen.getByText("Select method:")).toBeInTheDocument();
        expect(screen.getByTestId("select-method")).toBeInTheDocument();
    });

    it("should handle method change", () => {
        render(<Passcode />);
        const select = screen.getByTestId("select-method");
        fireEvent.change(select, {
            target: { value: PASSCODE_METHOD.AUTO_GENERATED },
        });

        expect(createTestActions.setPasscode).toHaveBeenCalledWith({
            method: PASSCODE_METHOD.AUTO_GENERATED,
        });
        expect(createTestActions.validate).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledTimes(2); // setPasscode + validate
    });

    it("should render auto generated options", () => {
        (useAppSelector as unknown as jest.Mock).mockImplementation(
            (selector) =>
                selector({
                    createTest: {
                        testId: "test-123",
                        passcode: {
                            ...initialPasscodeState,
                            method: PASSCODE_METHOD.AUTO_GENERATED,
                        },
                    },
                })
        );

        render(<Passcode />);
        expect(screen.getByText("Select passcode format:")).toBeInTheDocument();
        expect(screen.getByTestId("select-format")).toBeInTheDocument();
        expect(screen.getByText("Generate passcode")).toBeInTheDocument();
    });

    it("should handle generate passcode", () => {
        (useAppSelector as unknown as jest.Mock).mockImplementation(
            (selector) =>
                selector({
                    createTest: {
                        testId: "test-123",
                        passcode: {
                            ...initialPasscodeState,
                            method: PASSCODE_METHOD.AUTO_GENERATED,
                        },
                    },
                })
        );

        render(<Passcode />);
        fireEvent.click(screen.getByText("Generate passcode"));

        expect(createTestActions.setPasscode).toHaveBeenCalledWith({
            code: "123456",
        });
    });

    it("should render manual entry input", () => {
        (useAppSelector as unknown as jest.Mock).mockImplementation(
            (selector) =>
                selector({
                    createTest: {
                        testId: "test-123",
                        passcode: {
                            ...initialPasscodeState,
                            method: PASSCODE_METHOD.MANUALLY_ENTERED,
                        },
                    },
                })
        );

        render(<Passcode />);
        expect(screen.getByText("Passcode:")).toBeInTheDocument();
        expect(screen.getByTestId("input-code")).toBeInTheDocument();
    });

    it("should handle manual code input change", () => {
        (useAppSelector as unknown as jest.Mock).mockImplementation(
            (selector) =>
                selector({
                    createTest: {
                        testId: "test-123",
                        passcode: {
                            ...initialPasscodeState,
                            method: PASSCODE_METHOD.MANUALLY_ENTERED,
                        },
                    },
                })
        );

        render(<Passcode />);
        const input = screen.getByTestId("input-code");
        fireEvent.change(input, { target: { value: "secret" } });

        expect(createTestActions.setPasscode).toHaveBeenCalledWith({
            code: "secret",
        });
    });

    it("should render validity inputs when method is selected", () => {
        (useAppSelector as unknown as jest.Mock).mockImplementation(
            (selector) =>
                selector({
                    createTest: {
                        testId: "test-123",
                        passcode: {
                            ...initialPasscodeState,
                            method: PASSCODE_METHOD.MANUALLY_ENTERED,
                        },
                    },
                })
        );

        render(<Passcode />);
        expect(screen.getByTestId("input-valid_in")).toBeInTheDocument();
        expect(screen.getByTestId("select-valid_unit")).toBeInTheDocument();
        expect(screen.getByTestId("input-valid_till")).toBeInTheDocument();
    });

    it("should handle validity changes", () => {
        (useAppSelector as unknown as jest.Mock).mockImplementation(
            (selector) =>
                selector({
                    createTest: {
                        testId: "test-123",
                        passcode: {
                            ...initialPasscodeState,
                            method: PASSCODE_METHOD.MANUALLY_ENTERED,
                        },
                    },
                })
        );

        render(<Passcode />);

        fireEvent.change(screen.getByTestId("input-valid_in"), {
            target: { value: "60" },
        });
        expect(createTestActions.setPasscode).toHaveBeenCalledWith({
            valid_in: "60",
        });

        fireEvent.change(screen.getByTestId("select-valid_unit"), {
            target: { value: PASSCODE_VALID_UNIT.HOURS },
        });
        expect(createTestActions.setPasscode).toHaveBeenCalledWith({
            valid_unit: PASSCODE_VALID_UNIT.HOURS,
        });
    });
});
