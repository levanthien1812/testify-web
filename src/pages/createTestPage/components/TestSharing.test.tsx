import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TestSharing from "./TestSharing";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/hooks";
import { createTestActions } from "../../../stores/createTest";
import { useMutation } from "react-query";
import { SHARE_OPTIONS } from "../../../config/constants/tests";
import {
    updateTest,
    createPasscode,
    assignTakers,
} from "../../../services/test";

// Mocks
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));

jest.mock("../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("react-query", () => ({
    useMutation: jest.fn(),
}));

jest.mock("../../../services/test", () => ({
    updateTest: jest.fn(),
    createPasscode: jest.fn(),
    assignTakers: jest.fn(),
}));

jest.mock("../../../stores/createTest", () => ({
    createTestActions: {
        moveNextStep: jest.fn(),
        movePrevStep: jest.fn(),
        validate: jest.fn(),
        saveTestInfo: jest.fn(),
        setPasscode: jest.fn(),
        generateTestLink: jest.fn(),
        saveSelectedTestTakers: jest.fn(),
    },
}));

// Mock Child Components
jest.mock("./Wrapper", () => ({ viewData, children }: any) => (
    <div data-testid="wrapper">
        <h1>{viewData.headerTitle.text}</h1>
        <button
            onClick={viewData.bottomButtons.outlinedButton.onClick}
            data-testid="back-btn"
        >
            {viewData.bottomButtons.outlinedButton.text}
        </button>
        <button
            onClick={viewData.bottomButtons.containButton.onClick}
            disabled={viewData.bottomButtons.containButton.disabled}
            data-testid="save-btn"
        >
            {viewData.bottomButtons.containButton.isLoading
                ? viewData.bottomButtons.containButton.loadingText
                : viewData.bottomButtons.containButton.text}
        </button>
        {children}
    </div>
));

jest.mock("../../../components/elements/Select", () => (props: any) => (
    <select
        data-testid="share-select"
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
    >
        {props.options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
        ))}
    </select>
));

jest.mock(
    "../../../components/elements/InfoMessage",
    () =>
        ({ message }: any) =>
            <div data-testid="info-message">{message}</div>
);

jest.mock("./testSharing/Takers", () => () => (
    <div data-testid="takers-component" />
));
jest.mock("./testSharing/Passcode", () => () => (
    <div data-testid="passcode-component" />
));
jest.mock("./testSharing/Anyone", () => () => (
    <div data-testid="anyone-component" />
));

describe("TestSharing", () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

        // Mock useMutation to execute mutationFn and onSuccess
        (useMutation as jest.Mock).mockImplementation((options) => {
            return {
                mutate: jest.fn(async (data) => {
                    let result;
                    if (options.mutationFn) {
                        result = await options.mutationFn(data);
                    }
                    if (options.onSuccess) {
                        options.onSuccess(result);
                    }
                }),
                isLoading: false,
            };
        });

        (
            createTestActions.moveNextStep as unknown as jest.Mock
        ).mockReturnValue({ type: "MOVE_NEXT" });
        (
            createTestActions.movePrevStep as unknown as jest.Mock
        ).mockReturnValue({ type: "MOVE_PREV" });
        (createTestActions.validate as unknown as jest.Mock).mockReturnValue({
            type: "VALIDATE",
        });
        (
            createTestActions.saveTestInfo as unknown as jest.Mock
        ).mockReturnValue({ type: "SAVE_INFO" });
        (
            createTestActions.generateTestLink as unknown as jest.Mock
        ).mockReturnValue({ type: "GEN_LINK" });
        (
            createTestActions.setPasscode as unknown as jest.Mock
        ).mockImplementation((code) => ({
            type: "SET_PASSCODE",
            payload: code,
        }));
    });

    const defaultState = {
        testId: "test-123",
        shareOption: SHARE_OPTIONS.ANYONE,
        testLink: "http://test.com",
        selectedTestTakers: [{ id: "taker-1" }],
        passcode: { id: "pass-1", code: "123456" },
        isValidShareOption: true,
        editibility: {
            TEST_TAKERS: {
                share_option: true,
            },
        },
        notifyAssignment: false,
    };

    it("should render correctly with ANYONE option", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue(defaultState);

        render(<TestSharing />);

        expect(screen.getByTestId("wrapper")).toBeInTheDocument();
        expect(screen.getByTestId("share-select")).toHaveValue(
            SHARE_OPTIONS.ANYONE
        );
        expect(screen.getByTestId("anyone-component")).toBeInTheDocument();
        expect(
            screen.queryByTestId("takers-component")
        ).not.toBeInTheDocument();
        expect(
            screen.queryByTestId("passcode-component")
        ).not.toBeInTheDocument();

        // Check if generateTestLink was dispatched
        expect(createTestActions.generateTestLink).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith({ type: "GEN_LINK" });
    });

    it("should render correctly with RESTRICTED option", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            ...defaultState,
            shareOption: SHARE_OPTIONS.RESTRICTED,
        });

        render(<TestSharing />);

        expect(screen.getByTestId("share-select")).toHaveValue(
            SHARE_OPTIONS.RESTRICTED
        );
        expect(screen.getByTestId("takers-component")).toBeInTheDocument();
        expect(
            screen.queryByTestId("anyone-component")
        ).not.toBeInTheDocument();
    });

    it("should render correctly with PASSCODE option", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            ...defaultState,
            shareOption: SHARE_OPTIONS.PASSCODE,
        });

        render(<TestSharing />);

        expect(screen.getByTestId("share-select")).toHaveValue(
            SHARE_OPTIONS.PASSCODE
        );
        expect(screen.getByTestId("passcode-component")).toBeInTheDocument();
    });

    it("should handle share option change", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue(defaultState);

        render(<TestSharing />);

        const select = screen.getByTestId("share-select");
        fireEvent.change(select, {
            target: { value: SHARE_OPTIONS.RESTRICTED },
        });

        expect(createTestActions.saveTestInfo).toHaveBeenCalledWith({
            share_option: SHARE_OPTIONS.RESTRICTED,
        });
        expect(createTestActions.validate).toHaveBeenCalled();
    });

    it("should handle Save & Finish for ANYONE", async () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue(defaultState);

        render(<TestSharing />);

        fireEvent.click(screen.getByTestId("save-btn"));

        await waitFor(() => {
            expect(updateTest).toHaveBeenCalledWith("test-123", {
                share_option: SHARE_OPTIONS.ANYONE,
            });
        });

        expect(assignTakers).not.toHaveBeenCalled();
        expect(createPasscode).not.toHaveBeenCalled();
        expect(createTestActions.moveNextStep).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/tests");
    });

    it("should handle Save & Finish for RESTRICTED", async () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            ...defaultState,
            shareOption: SHARE_OPTIONS.RESTRICTED,
        });

        render(<TestSharing />);

        fireEvent.click(screen.getByTestId("save-btn"));

        await waitFor(() => {
            expect(updateTest).toHaveBeenCalledWith("test-123", {
                share_option: SHARE_OPTIONS.RESTRICTED,
            });
        });

        expect(assignTakers).toHaveBeenCalledWith(
            "test-123",
            ["taker-1"],
            false
        );
        expect(createPasscode).not.toHaveBeenCalled();
        expect(createTestActions.moveNextStep).toHaveBeenCalled();
    });

    it("should handle Save & Finish for PASSCODE", async () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            ...defaultState,
            shareOption: SHARE_OPTIONS.PASSCODE,
        });
        (createPasscode as jest.Mock).mockResolvedValue({
            passcode: { code: "new-code" },
        });

        render(<TestSharing />);

        fireEvent.click(screen.getByTestId("save-btn"));

        await waitFor(() => {
            expect(updateTest).toHaveBeenCalledWith("test-123", {
                share_option: SHARE_OPTIONS.PASSCODE,
            });
        });

        // It calls updateTest twice: once for share_option, once for passcode_id
        expect(updateTest).toHaveBeenCalledWith("test-123", {
            passcode_id: "pass-1",
        });
        expect(createPasscode).toHaveBeenCalledWith(
            "test-123",
            defaultState.passcode
        );
        expect(createTestActions.setPasscode).toHaveBeenCalledWith({
            code: "new-code",
        });
        expect(createTestActions.moveNextStep).toHaveBeenCalled();
    });

    it("should handle Back button", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue(defaultState);

        render(<TestSharing />);

        fireEvent.click(screen.getByTestId("back-btn"));

        expect(createTestActions.movePrevStep).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith({ type: "MOVE_PREV" });
    });

    it("should disable Save button if invalid or loading", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            ...defaultState,
            isValidShareOption: false,
        });

        render(<TestSharing />);
        expect(screen.getByTestId("save-btn")).toBeDisabled();
    });
});
