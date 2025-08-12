import React from "react";
import { QuestionResult } from "../../../types/tests";
import { Bar } from "react-chartjs-2";

type QuestionsResultChartProps = {
    questionsResult: QuestionResult[];
};

const QuestionsResultChart = ({
    questionsResult,
}: QuestionsResultChartProps) => {
    const options = {
        plugins: {
            title: {
                display: true,
                text: "Question Result Analysis",
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    const labels = questionsResult.map((questionResult) => {
        return `Question ${questionResult.question.order}`;
    });

    const config = {
        labels,
        datasets: [
            {
                label: "Correct answers",
                data: questionsResult.map(
                    (questionResult) => questionResult.correct
                ),
                backgroundColor: "oklch(77.7% 0.152 181.912)",
            },
            {
                label: "Wrong answers",
                data: questionsResult.map(
                    (questionResult) => questionResult.wrong
                ),
                backgroundColor: "oklch(70.4% 0.191 22.216)",
            },
            {
                label: "Skipped answers",
                data: questionsResult.map(
                    (questionResult) => questionResult.skipped
                ),
                backgroudColor: "rgba(255, 206, 86, 0.5)",
            },
        ],
    };
    return (
        <div className="h-80 md:h-96">
            <Bar options={options} data={config} />
        </div>
    );
};

export default QuestionsResultChart;
