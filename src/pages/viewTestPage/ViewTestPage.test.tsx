import { render, waitFor } from "@testing-library/react";
import ViewTestPage from "./ViewTestPage";
import { MemoryRouter, useParams } from "react-router";
import { getTest } from "../../services/test";
import { useAppSelector } from "../../hooks/hooks";
import { useQuery } from "react-query";

jest.mock("./components/Statistics", () => ({
    __esModule: true,
    default: () => <div data-testid="statistics">Statistics</div>,
}));
jest.mock("./components/TestInfo", () => ({
    __esModule: true,
    default: () => <div data-testid="test-info">TestInfo</div>,
}));
jest.mock("./components/TopTakers", () => ({
    __esModule: true,
    default: () => <div data-testid="top-takers">TopTakers</div>,
}));
jest.mock("./components/ScoreRangeBarChart", () => ({
    __esModule: true,
    default: () => (
        <div data-testid="score-range-bar-chart">ScoreRangeBarChart</div>
    ),
}));
jest.mock("./components/QuestionsResultChart", () => ({
    __esModule: true,
    default: () => (
        <div data-testid="questions-result-chart">QuestionsResultChart</div>
    ),
}));
jest.mock("../../components/loadings/Loading", () => ({
    __esModule: true,
    default: ({ isLoading }: any) =>
        isLoading ? <div data-testid="loading">Loading...</div> : null,
}));
jest.mock("../../components/modals/Modal", () => {
    return {
        __esModule: true,
        default: ({ children }: any) => (
            <div data-testid="modal">{children}</div>
        ),
        ModalHeader: () => <div>Header</div>,
        ModalBody: ({ children }: any) => <div>{children}</div>,
        ModalFooter: () => <div>Footer</div>,
    };
});
jest.mock("../../components/elements/Button", () => ({
    __esModule: true,
    default: ({ children, onClick }: any) => (
        <div data-testid="button" onClick={onClick}>
            {children}
        </div>
    ),
}));
jest.mock("./components/SubmissionsTable", () => ({
    __esModule: true,
    default: () => <div data-testid="submissions-table">SubmissionsTable</div>,
}));
jest.mock("../others/MessageAction", () => ({
    __esModule: true,
    default: () => <div data-testid="message-action">MessageAction</div>,
}));
jest.mock("../createTestPage/components/TestAnswers", () => ({
    __esModule: true,
    default: () => <div data-testid="test-answers">TestAnswers</div>,
}));
jest.mock("./components/TestQuestionsAndAnswers", () => ({
    __esModule: true,
    default: () => (
        <div data-testid="test-questions-and-answers">
            TestQuestionsAndAnswers
        </div>
    ),
}));
jest.mock("../others/SkeletonWrapper", () => ({
    __esModule: true,
    default: ({ children }: any) => (
        <div data-testid="skeleton-wrapper">{children}</div>
    ),
}));

jest.mock("../../services/test", () => ({
    getTest: jest.fn(),
    getSubmissions: jest.fn(),
    getQuestionsResultForTest: jest.fn(),
}));

jest.mock("../../stores/viewTest", () => ({
    viewTestActions: {
        setTest: jest.fn(),
        setSubmissions: jest.fn(),
        setScores: jest.fn(),
        setRates: jest.fn(),
        setAverageTime: jest.fn(),
        setQuestionsResult: jest.fn(),
    },
}));

jest.mock("../../hooks/hooks", () => ({
    useAppSelector: jest.fn().mockReturnValue({
        test: null,
        submissions: [],
        questionsResult: [],
        scores: {},
        rates: {},
        averageTime: 0,
    }),
}));

jest.mock("react-query", () => ({
    useQuery: jest.fn(),
}));

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: jest.fn(),
    useParams: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    Link: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("../../config/constants/queryMutationKeys", () => ({
    QUERY_KEYS: {
        GET_TEST: "GET_TEST",
        GET_TEST_SUBMISSIONS: "GET_TEST_SUBMISSIONS",
        GET_QUESTIONS_RESULT_FOR_TEST: "GET_QUESTIONS_RESULT_FOR_TEST",
    },
}));

jest.mock("../../config/constants/tests", () => ({
    TEST_STATUS: {
        DRAFT: "draft",
        PUBLISHABLE: "publishable",
    },
    PUBLIC_ANSWERS_OPTIONS: {
        AFTER_CLOSE_TIME: "AFTER_CLOSE_TIME",
    },
    PAGINATION_MODE: {
        ALL: "ALL",
    },
    RECORD_MODE: {
        SCREEN_SHOTS: "SCREEN_SHOTS",
    },
    TEST_LEVEL: {
        EASY: "EASY",
    },
}));

jest.mock("../../config/constants/initialValues.ts", () => ({
    INITIAL_OPTIONS: "INITIAL_OPTIONS",
}));

jest.mock("chart.js", () => ({
    Chart: {
        register: jest.fn(),
    },
    CategoryScale: jest.fn(),
    LinearScale: jest.fn(),
    BarElement: jest.fn(),
    Title: jest.fn(),
    Tooltip: jest.fn(),
    Legend: jest.fn(),
    defaults: {
        font: {
            family: "'EB Garamond', serif",
            size: 16,
        },
    },
}));

const renderComponent = () => {
    return render(
        <MemoryRouter initialEntries={["tests/test-1"]}>
            <ViewTestPage />
        </MemoryRouter>
    );
};

describe("ViewTestPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useParams as unknown as jest.Mock).mockReturnValue({
            testId: "test-1",
        });
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            test: null,
            submissions: [],
            questionsResult: [],
        });
        (useQuery as jest.Mock).mockImplementation(
            ({ queryFn, enabled = true }: any) => {
                if (enabled && queryFn) {
                    queryFn();
                }
                return { isLoading: false, data: null, refetch: jest.fn() };
            }
        );
        (getTest as jest.Mock).mockResolvedValue({});
    });

    test("it should render correctly when test data is available", async () => {
        renderComponent();

        await waitFor(() => {
            expect(getTest).toHaveBeenCalledTimes(1);
        });
        expect(getTest).toHaveBeenCalledWith("test-1", { detailed: false });
    });
});
