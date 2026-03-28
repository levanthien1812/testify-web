import { act, render } from "@testing-library/react";
import CreateTestTour from "./CreateTestTour";
import { useAppSelector } from "../../../hooks/hooks";
import { CREATE_TEST_STEPS } from "../../../config/constants/tests";
import Joyride, { STATUS } from "react-joyride";

// Mock hooks
jest.mock("../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

// Mock react-joyride
jest.mock("react-joyride", () => ({
    __esModule: true,
    default: jest.fn(() => <div data-testid="joyride" />),
    STATUS: {
        FINISHED: "finished",
        SKIPPED: "skipped",
    },
}));

describe("CreateTestTour", () => {
    const mockLocalStorageGet = jest.fn();
    const mockLocalStorageSet = jest.fn();

    beforeAll(() => {
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: mockLocalStorageGet,
                setItem: mockLocalStorageSet,
            },
            writable: true,
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should run tour if not viewed previously for TEST_INFORMATION", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            currentStep: CREATE_TEST_STEPS.TEST_INFORMATION,
        });
        mockLocalStorageGet.mockReturnValue(null); // Not viewed

        render(<CreateTestTour />);

        expect(Joyride).toHaveBeenCalledWith(
            expect.objectContaining({
                run: true,
                steps: expect.arrayContaining([
                    expect.objectContaining({ target: "body" }),
                    expect.objectContaining({ target: "#test-info-section" }),
                ]),
            }),
            {}
        );
    });

    it("should not run tour if viewed previously", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            currentStep: CREATE_TEST_STEPS.TEST_INFORMATION,
        });
        mockLocalStorageGet.mockReturnValue("true"); // Viewed

        render(<CreateTestTour />);

        expect(Joyride).toHaveBeenCalledWith(
            expect.objectContaining({
                run: false,
            }),
            {}
        );
    });

    it("should render correct steps for TEST_PARTS", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            currentStep: CREATE_TEST_STEPS.TEST_PARTS,
        });
        mockLocalStorageGet.mockReturnValue(null);

        render(<CreateTestTour />);

        expect(Joyride).toHaveBeenCalledWith(
            expect.objectContaining({
                run: true,
                steps: expect.arrayContaining([
                    expect.objectContaining({ target: "#test-parts-section" }),
                ]),
            }),
            {}
        );
    });

    it("should render correct steps for TEST_QUESTIONS", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            currentStep: CREATE_TEST_STEPS.TEST_QUESTIONS,
        });
        mockLocalStorageGet.mockReturnValue(null);

        render(<CreateTestTour />);

        expect(Joyride).toHaveBeenCalledWith(
            expect.objectContaining({
                run: true,
                steps: expect.arrayContaining([
                    expect.objectContaining({
                        target: "#test-questions-section",
                    }),
                    expect.objectContaining({ target: "#question-list" }),
                ]),
            }),
            {}
        );
    });

    it("should render correct steps for TEST_ANSWERS", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            currentStep: CREATE_TEST_STEPS.TEST_ANSWERS,
        });
        mockLocalStorageGet.mockReturnValue(null);

        render(<CreateTestTour />);

        expect(Joyride).toHaveBeenCalledWith(
            expect.objectContaining({
                run: true,
                steps: expect.arrayContaining([
                    expect.objectContaining({
                        target: "#test-answers-section",
                    }),
                ]),
            }),
            {}
        );
    });

    it("should render correct steps for TEST_TAKERS (Sharing)", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            currentStep: CREATE_TEST_STEPS.TEST_TAKERS,
        });
        mockLocalStorageGet.mockReturnValue(null);

        render(<CreateTestTour />);

        expect(Joyride).toHaveBeenCalledWith(
            expect.objectContaining({
                run: true,
                steps: expect.arrayContaining([
                    expect.objectContaining({
                        target: "#test-sharing-section",
                    }),
                    expect.objectContaining({ target: "#status-panel" }),
                ]),
            }),
            {}
        );
    });

    it("should set localStorage when tour finishes", async () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            currentStep: CREATE_TEST_STEPS.TEST_INFORMATION,
        });
        mockLocalStorageGet.mockReturnValue(null);

        render(<CreateTestTour />);

        // Get the callback passed to Joyride
        // Joyride is a mock function, so we can inspect calls
        const lastCall = (Joyride as unknown as jest.Mock).mock.calls.find(
            (call) => call[0].steps.length > 0
        );
        const joyrideProps = lastCall[0];
        const callback = joyrideProps.callback;

        // Simulate finish
        act(() => {
            callback({ status: STATUS.FINISHED });
        });

        expect(mockLocalStorageSet).toHaveBeenCalledWith(
            `createTestTour_${CREATE_TEST_STEPS.TEST_INFORMATION}_viewed`,
            "true"
        );
    });

    it("should set localStorage when tour is skipped", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            currentStep: CREATE_TEST_STEPS.TEST_INFORMATION,
        });
        mockLocalStorageGet.mockReturnValue(null);

        render(<CreateTestTour />);

        const lastCall = (Joyride as unknown as jest.Mock).mock.calls.find(
            (call) => call[0].steps.length > 0
        );
        const joyrideProps = lastCall[0];
        const callback = joyrideProps.callback;

        // Simulate skip
        act(() => {
            callback({ status: STATUS.SKIPPED });
        });

        expect(mockLocalStorageSet).toHaveBeenCalledWith(
            `createTestTour_${CREATE_TEST_STEPS.TEST_INFORMATION}_viewed`,
            "true"
        );
    });
});
