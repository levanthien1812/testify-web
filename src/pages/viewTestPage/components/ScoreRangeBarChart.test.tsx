import { render } from "@testing-library/react";
import ScoreRangeBarChart from "./ScoreRangeBarChart";
import { useAppSelector } from "../../../hooks/hooks";
import { SubmissionItf, TakerItf } from "../../../types/types";
import { ROLES } from "../../../config/constants/tests";

jest.mock("../../../utils/array", () => ({
    generateEvenRanges: jest.fn(),
}));

jest.mock("../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("react-chartjs-2", () => ({
    Bar: jest.fn(),
}));

// Factory function to create mock submissions.
// This is a great pattern for generating test data. It provides a complete, valid default object,
// and you can easily override just the fields you need for a specific test case.
const createMockSubmission = (
    overrides: Partial<SubmissionItf>
): SubmissionItf => {
    const defaultTaker: TakerItf = {
        id: "taker-1",
        name: "Default Taker",
        user: {
            id: "user-1",
            name: "Default Taker",
            email: "default.taker@example.com",
            photo: "https://example.com/avatar.jpg",
            role: ROLES.TAKER,
        },
        maker_id: "maker-1",
        user_id: "user-1",
        onboarded: true,
    };

    const defaultSubmission: SubmissionItf = {
        id: "sub-1",
        test_id: "test-1",
        taker: defaultTaker,
        start_time: new Date("2023-01-01T10:00:00Z"),
        submit_time: new Date("2023-01-01T10:15:00Z"),
        score: 85,
        correct_answers: 8,
        wrong_answers: 1,
        is_evaluated: true,
        taker_id: "taker-1",
    };

    return {
        ...defaultSubmission,
        ...overrides,
    };
};

const renderComponent = ({ submissions }: { submissions: SubmissionItf[] }) => {
    render(<ScoreRangeBarChart submissions={submissions} />);
};

describe("ScoreRangeBarChart", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            test: {
                max_score: 100,
            },
        });
    });

    it("should render correctly with calculated chart data", () => {
        const mockSubmissions = [
            createMockSubmission({ id: "1", score: 5 }), // Fits in 0-10
            createMockSubmission({ id: "2", score: 15 }), // Fits in 10-20
            createMockSubmission({ id: "3", score: 45 }), // Fits in 40-50
        ];

        (
            require("../../../utils/array").generateEvenRanges as jest.Mock
        ).mockReturnValue([
            [0, 10],
            [10, 20],
            [20, 30],
            [30, 40],
            [40, 50],
        ]);

        renderComponent({ submissions: mockSubmissions });

        const Bar = require("react-chartjs-2").Bar;
        expect(Bar).toHaveBeenCalledTimes(1);

        // Verify the data passed to the chart
        const chartProps = Bar.mock.calls[0][0];
        const { data } = chartProps;

        expect(data.labels).toEqual([
            "0 - <10",
            "10 - <20",
            "20 - <30",
            "30 - <40",
            "40 - <50",
        ]);

        // Expected counts: [1, 1, 0, 0, 1]
        expect(data.datasets[0].data).toEqual([1, 1, 0, 0, 1]);
    });

    it("should handle empty submissions", () => {
        renderComponent({ submissions: [] });
        const Bar = require("react-chartjs-2").Bar;
        const chartProps = Bar.mock.calls[0][0];
        // Should have 0 for all ranges
        expect(
            chartProps.data.datasets[0].data.every((d: number) => d === 0)
        ).toBe(true);
    });
});
