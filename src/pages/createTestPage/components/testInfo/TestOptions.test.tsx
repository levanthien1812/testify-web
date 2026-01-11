import { render, screen, fireEvent } from "@testing-library/react";
import TestOptions from "./TestOptions";
import { useFormContext } from "react-hook-form";
import { useAppSelector } from "../../../../hooks/hooks";
import { TEST_OPTIONS_LABELS } from "../../../../config/constants/tests";

// Mock dependencies
jest.mock("react-hook-form", () => ({
    useFormContext: jest.fn(),
}));

jest.mock("../../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

// Mock child components to simplify testing
jest.mock("../../../../components/accordions/Accordion", () => ({
    __esModule: true,
    default: ({ children, viewData }: any) => (
        <div data-testid="accordion">
            <button onClick={viewData.onToggle}>{viewData.title.text}</button>
            {viewData.open && <div>{children}</div>}
        </div>
    ),
}));

jest.mock("./TestOption", () => ({
    __esModule: true,
    default: ({ mainOption, subOptions, additionalInfo }: any) => (
        <div data-testid="test-option">
            <div data-testid="main-option">{mainOption}</div>
            <div data-testid="sub-options">{subOptions}</div>
            {additionalInfo && (
                <div data-testid="additional-info">{additionalInfo}</div>
            )}
        </div>
    ),
}));

jest.mock("../../../../components/elements/Checkbox", () => ({
    __esModule: true,
    default: ({ label, sizing, ...props }: any) => (
        <label>
            <input type="checkbox" {...props} />
            {label?.text}
        </label>
    ),
}));

jest.mock("../../../../components/elements/Input", () => ({
    __esModule: true,
    default: ({ label, helperText, sizing, ...props }: any) => (
        <label>
            {label?.text}
            <input {...props} />
        </label>
    ),
}));

jest.mock("../../../../components/elements/Select", () => ({
    __esModule: true,
    default: ({ label, options, ...props }: any) => (
        <label>
            {label?.text}
            <select {...props}>
                {options &&
                    options.map((opt: any) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
            </select>
        </label>
    ),
}));

describe("TestOptions", () => {
    const mockRegister = jest.fn();
    const defaultOptions = {
        allow_close_time: { enable: false },
        allow_view_submission_after_test: { enable: false },
        allow_multiple_submissions: { enable: false },
        allow_save_progress: { enable: false },
        allow_show_taker_answers_after_test: { enable: false },
        allow_show_maker_answers_after_test: {
            enable: false,
            public_answers_option: "IMMEDIATELY",
        },
        allow_shuffle_questions: { enable: false },
        allow_shuffle_answers: { enable: false },
        allow_review_before_submission: { enable: false },
        disallow_time_limit: { enable: false },
        pagination_mode: { enable: false, mode: "ALL" },
        require_screen_recorder: { enable: false, record_mode: "VIDEO" },
        require_camera_on: { enable: false, record_mode: "VIDEO" },
    };

    const defaultEditibility = {
        TEST_INFORMATION: {
            options: {
                allow_close_time: true,
                allow_view_submission_after_test: true,
                allow_multiple_submissions: true,
                allow_save_progress: true,
                allow_show_taker_answers_after_test: true,
                allow_show_maker_answers_after_test: true,
                allow_shuffle_questions: true,
                allow_shuffle_answers: true,
                allow_review_before_submission: true,
                disallow_time_limit: true,
                pagination_mode: true,
                require_screen_recorder: true,
                require_camera_on: true,
            },
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useFormContext as jest.Mock).mockReturnValue({
            register: mockRegister,
        });
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            options: defaultOptions,
            editibility: defaultEditibility,
            numParts: 1,
        });
    });

    it("should render accordion title", () => {
        render(<TestOptions />);
        expect(screen.getByText("Options")).toBeInTheDocument();
    });

    it("should toggle accordion content", () => {
        render(<TestOptions />);
        const toggleButton = screen.getByText("Options");

        expect(screen.queryByTestId("test-option")).not.toBeInTheDocument();

        fireEvent.click(toggleButton);
        expect(screen.getAllByTestId("test-option").length).toBeGreaterThan(0);
    });

    it("should render all test options when open", () => {
        render(<TestOptions />);
        fireEvent.click(screen.getByText("Options"));

        Object.values(TEST_OPTIONS_LABELS)
            .filter((label: any) => label.MAKER)
            .forEach((label: any) => {
                expect(screen.getByText(label.MAKER)).toBeInTheDocument();
            });
    });

    it("should render additional info when option is enabled", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            options: {
                ...defaultOptions,
                allow_close_time: { enable: true },
            },
            editibility: defaultEditibility,
            numParts: 1,
        });

        render(<TestOptions />);
        fireEvent.click(screen.getByText("Options"));

        expect(screen.getByText("Close time")).toBeInTheDocument();
    });

    it("should disable inputs based on editibility", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            options: defaultOptions,
            editibility: {
                TEST_INFORMATION: {
                    options: {
                        ...defaultEditibility.TEST_INFORMATION.options,
                        allow_close_time: false,
                    },
                },
            },
            numParts: 1,
        });

        render(<TestOptions />);
        fireEvent.click(screen.getByText("Options"));

        const checkbox = screen.getByLabelText(
            TEST_OPTIONS_LABELS.ALLOW_CLOSE_TIME.MAKER
        );
        expect(checkbox).toBeDisabled();
    });

    it("should render maximum submissions input when allow_multiple_submissions is enabled", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            options: {
                ...defaultOptions,
                allow_multiple_submissions: { enable: true },
            },
            editibility: defaultEditibility,
            numParts: 1,
        });

        render(<TestOptions />);
        fireEvent.click(screen.getByText("Options"));

        expect(screen.getByText("Maximum submissions")).toBeInTheDocument();
    });

    it("should render public answers options when allow_show_maker_answers_after_test is enabled", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            options: {
                ...defaultOptions,
                allow_show_maker_answers_after_test: {
                    enable: true,
                    public_answers_option: "IMMEDIATELY",
                },
            },
            editibility: defaultEditibility,
            numParts: 1,
        });

        render(<TestOptions />);
        fireEvent.click(screen.getByText("Options"));

        expect(screen.getByText("Public answers options")).toBeInTheDocument();
    });

    it("should render public answers date when option is SPECIFIC_DATE", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            options: {
                ...defaultOptions,
                allow_show_maker_answers_after_test: {
                    enable: true,
                    public_answers_option: "SPECIFIC_DATE",
                },
            },
            editibility: defaultEditibility,
            numParts: 1,
        });

        render(<TestOptions />);
        fireEvent.click(screen.getByText("Options"));

        expect(screen.getByText("Public answers date")).toBeInTheDocument();
    });

    it("should render questions per page input when pagination mode is FIXED_PER_PAGE", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            options: {
                ...defaultOptions,
                pagination_mode: { enable: true, mode: "FIXED_PER_PAGE" },
            },
            editibility: defaultEditibility,
            numParts: 1,
        });

        render(<TestOptions />);
        fireEvent.click(screen.getByText("Options"));

        expect(
            screen.getByText("Number of questions per page")
        ).toBeInTheDocument();
    });

    it("should render navigation checkboxes when pagination mode is not ALL", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            options: {
                ...defaultOptions,
                pagination_mode: { enable: true, mode: "ONE_QUESTION" },
            },
            editibility: defaultEditibility,
            numParts: 1,
        });

        render(<TestOptions />);
        fireEvent.click(screen.getByText("Options"));

        expect(
            screen.getByText("Lock move backward to previous question/part")
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "Require answer(s) before moving next question/part"
            )
        ).toBeInTheDocument();
    });

    it("should render screen recorder options when enabled", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            options: {
                ...defaultOptions,
                require_screen_recorder: { enable: true, record_mode: "VIDEO" },
            },
            editibility: defaultEditibility,
            numParts: 1,
        });

        render(<TestOptions />);
        fireEvent.click(screen.getByText("Options"));

        expect(screen.getByText("Include audio")).toBeInTheDocument();
    });

    it("should render screen shot interval when record mode is SCREEN_SHOTS", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            options: {
                ...defaultOptions,
                require_screen_recorder: {
                    enable: true,
                    record_mode: "SCREEN_SHOTS",
                },
            },
            editibility: defaultEditibility,
            numParts: 1,
        });

        render(<TestOptions />);
        fireEvent.click(screen.getByText("Options"));

        expect(
            screen.getByText("Take a screen shot after each (seconds)")
        ).toBeInTheDocument();
    });

    it("should render camera options when enabled", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            options: {
                ...defaultOptions,
                require_camera_on: { enable: true, record_mode: "VIDEO" },
            },
            editibility: defaultEditibility,
            numParts: 1,
        });

        render(<TestOptions />);
        fireEvent.click(screen.getByText("Options"));

        expect(screen.getByText("Include audio")).toBeInTheDocument();
    });

    it("should render screen shot interval when camera record mode is SCREEN_SHOTS", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            options: {
                ...defaultOptions,
                require_camera_on: {
                    enable: true,
                    record_mode: "SCREEN_SHOTS",
                },
            },
            editibility: defaultEditibility,
            numParts: 1,
        });

        render(<TestOptions />);
        fireEvent.click(screen.getByText("Options"));

        expect(
            screen.getByText("Take a screen shot after each (seconds)")
        ).toBeInTheDocument();
    });
});
