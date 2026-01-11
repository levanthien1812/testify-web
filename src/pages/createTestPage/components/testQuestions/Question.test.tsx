import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Question from "./Question";
import { useAppSelector } from "../../../../hooks/hooks";
import { useDispatch } from "react-redux";
import { useMutation } from "react-query";
import { createTestActions } from "../../../../stores/createTest";
import {
    saveQuestion,
    deleteQuestion as deleteQuestionApi,
} from "../../../../services/test";
import { QUESTION_TYPE } from "../../../../config/constants/tests";

jest.mock("../../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("../../../../services/test", () => ({
    saveQuestion: jest.fn(),
    deleteQuestion: jest.fn(),
}));

jest.mock("../../../../stores/createTest", () => ({
    createTestActions: {
        saveTestQuestions: jest.fn(),
        validate: jest.fn(),
        deleteQuestion: jest.fn(),
    },
}));

jest.mock("./QuestionDraggable", () => ({ onClick }: any) => (
    <div data-testid="question-draggable" onClick={onClick}>
        Question Draggable
    </div>
));

jest.mock("../../../../components/modals/Modal", () => {
    const MockModal = ({ children, onClose }: any) => (
        <div data-testid="modal">
            <button onClick={onClose}>Close Modal</button>
            {children}
        </div>
    );
    return {
        __esModule: true,
        default: MockModal,
        ModalHeader: ({ title }: any) => <div>{title}</div>,
        ModalBody: ({ children }: any) => <div>{children}</div>,
    };
});

jest.mock(
    "../../../../components/modals/ConfirmModal",
    () =>
        ({ onConfirm, onClose }: any) =>
            (
                <div data-testid="confirm-modal">
                    <button onClick={onConfirm}>Confirm</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            )
);

jest.mock("./MultipleChoicesQuestion", () => () => (
    <div data-testid="mc-question">MC Question</div>
));
jest.mock("./FillGapsQuestion", () => () => (
    <div data-testid="fg-question">FG Question</div>
));
jest.mock("./MatchingQuestion", () => () => (
    <div data-testid="matching-question">Matching Question</div>
));
jest.mock("./ResponseQuestion", () => () => (
    <div data-testid="response-question">Response Question</div>
));
jest.mock("./TrueFalseQuestion", () => () => (
    <div data-testid="tf-question">TF Question</div>
));
jest.mock(
    "../../../questionBankDetailPage/components/ImportQuestionFromAnotherBank",
    () => () => <div data-testid="import-bank">Import Bank</div>
);

jest.mock("../../../../components/elements/Input", () => {
    const React = require("react");
    return {
        __esModule: true,
        default: React.forwardRef(({ label, ...props }: any, ref: any) => (
            <label>
                {label?.text}
                <input ref={ref} {...props} />
            </label>
        )),
    };
});

jest.mock("../../../../components/elements/Select", () => {
    const React = require("react");
    return {
        __esModule: true,
        default: React.forwardRef(
            ({ label, options, ...props }: any, ref: any) => (
                <label>
                    {label?.text}
                    <select ref={ref} {...props}>
                        {options.map((opt: any) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </label>
            )
        ),
    };
});

jest.mock(
    "../../../../components/elements/Button",
    () =>
        ({ children, ...props }: any) =>
            <button {...props}>{children}</button>
);

jest.mock("../../../../components/elements/Checkbox", () => {
    const React = require("react");
    return {
        __esModule: true,
        default: React.forwardRef(({ label, ...props }: any, ref: any) => (
            <label>
                {label?.text}
                <input type="checkbox" ref={ref} {...props} />
            </label>
        )),
    };
});

jest.mock("../../../../utils/mapping", () => ({
    getInitialQuestionContent: jest.fn(() => ({})),
}));

describe("Question", () => {
    const mockDispatch = jest.fn();
    const mockSaveQuestion = jest.fn();
    const mockDeleteQuestionApi = jest.fn();

    const defaultQuestion = {
        id: "q1",
        order: 1,
        score: 10,
        type: QUESTION_TYPE.MULTIPLE_CHOICES,
        content: { text: "Question text" },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (saveQuestion as jest.Mock).mockImplementation(mockSaveQuestion);
        (deleteQuestionApi as jest.Mock).mockImplementation(
            mockDeleteQuestionApi
        );

        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testId: "test-123",
            numQuestions: 5,
            editibility: {
                TEST_QUESTIONS: {
                    score: true,
                    type: true,
                    level: true,
                    partial_scoring: true,
                    content: true,
                },
            },
        });

        (useMutation as jest.Mock).mockImplementation((options) => ({
            mutate: jest.fn((data) => {
                if (options.mutationFn) {
                    options.mutationFn(data);
                }
                if (options.onSuccess) {
                    options.onSuccess({
                        question: defaultQuestion,
                        content: {},
                    });
                }
            }),
            isLoading: false,
        }));
    });

    it("should render draggable component initially", () => {
        render(<Question question={defaultQuestion as any} />);
        expect(screen.getByTestId("question-draggable")).toBeInTheDocument();
        expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("should open modal when draggable is clicked", () => {
        render(<Question question={defaultQuestion as any} />);
        fireEvent.click(screen.getByTestId("question-draggable"));
        expect(screen.getByTestId("modal")).toBeInTheDocument();
        expect(screen.getByLabelText("Score")).toHaveValue(10);
        expect(screen.getByLabelText("Type")).toHaveValue(
            QUESTION_TYPE.MULTIPLE_CHOICES
        );
    });

    it("should call saveQuestion (update) when form is submitted", async () => {
        const user = userEvent.setup();
        render(<Question question={defaultQuestion as any} />);
        fireEvent.click(screen.getByTestId("question-draggable"));

        const scoreInput = screen.getByLabelText("Score");
        await user.clear(scoreInput);
        await user.type(scoreInput, "20");

        await user.click(screen.getByText("Save"));

        await waitFor(() => {
            expect(mockSaveQuestion).toHaveBeenCalledWith(
                "test-123",
                expect.objectContaining({ score: "20" }),
                "q1"
            );
        });
        expect(createTestActions.saveTestQuestions).toHaveBeenCalled();
    });

    it("should call saveQuestion (create) when question has no id", async () => {
        const newQuestion = { ...defaultQuestion, id: undefined };
        const user = userEvent.setup();
        render(<Question question={newQuestion as any} />);
        fireEvent.click(screen.getByTestId("question-draggable"));

        await user.click(screen.getByText("Save"));

        await waitFor(() => {
            expect(mockSaveQuestion).toHaveBeenCalledWith(
                "test-123",
                expect.objectContaining({ score: 10 })
            );
        });
    });

    it("should call deleteQuestionApi when delete is confirmed", async () => {
        const user = userEvent.setup();
        render(<Question question={defaultQuestion as any} />);
        fireEvent.click(screen.getByTestId("question-draggable"));

        await user.click(screen.getByText("Delete"));
        expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();

        await user.click(screen.getByText("Confirm"));

        await waitFor(() => {
            expect(mockDeleteQuestionApi).toHaveBeenCalledWith(
                "test-123",
                "q1",
                expect.any(Object)
            );
        });
        expect(createTestActions.deleteQuestion).toHaveBeenCalled();
    });

    it("should change content component when type is changed", async () => {
        const user = userEvent.setup();
        render(<Question question={defaultQuestion as any} />);
        fireEvent.click(screen.getByTestId("question-draggable"));

        expect(screen.getByTestId("mc-question")).toBeInTheDocument();

        const typeSelect = screen.getByLabelText("Type");
        await user.selectOptions(typeSelect, QUESTION_TYPE.TRUE_FALSE);
        expect(await screen.findByTestId("tf-question")).toBeInTheDocument();
    });

    it("should display partial scoring info when enabled", () => {
        const partialQuestion = {
            ...defaultQuestion,
            partial_scoring: true,
            type: QUESTION_TYPE.MULTIPLE_CHOICES,
        };
        render(<Question question={partialQuestion as any} />);
        fireEvent.click(screen.getByTestId("question-draggable"));
        expect(
            screen.getByText(/point per correct answer item/)
        ).toBeInTheDocument();
    });

    it("should open import modal when import button is clicked", async () => {
        const user = userEvent.setup();
        render(<Question question={defaultQuestion as any} />);
        fireEvent.click(screen.getByTestId("question-draggable"));

        await user.click(screen.getByText("Import from question bank"));
        expect(screen.getByTestId("import-bank")).toBeInTheDocument();
    });
});
