import React, { useMemo } from "react";
import { SubmissionItf } from "../../../types/types";
import { Bar } from "react-chartjs-2";
import { useAppSelector } from "../../../hooks/hooks";
import { generateEvenRanges } from "../../../utils/array";

type Props = {
    submissions: SubmissionItf[];
};

const ScoreRangeBarChart = ({ submissions }: Props) => {
    const { test } = useAppSelector((state) => state.viewTest);
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Score Range Bar Chart",
            },
        },
    };

    const ranges = useMemo(() => {
        if (!test) return [];
        return generateEvenRanges(test.max_score, 10);
    }, [test]);

    const labels = ranges.map((range) => {
        return `${range[0]} - <${range[1]}`;
    });

    const getNoOfSubmisstionsByScoreRange = (range: number[]) => {
        return submissions.filter((submission) => {
            const score = submission.score || 0;
            return score >= range[0] && score < range[1];
        }).length;
    };

    const config = {
        labels,
        datasets: [
            {
                label: "Number of submissions",
                data: ranges.map((range) => {
                    return getNoOfSubmisstionsByScoreRange(range);
                }),
                backgroundColor: "oklch(75% 0.183 55.934)",
            },
        ],
    };

    return (
        <div className="h-80 md:h-96">
            <Bar data={config} options={options} />
        </div>
    );
};

export default ScoreRangeBarChart;
