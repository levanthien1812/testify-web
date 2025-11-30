import React from "react";
import Skeleton from "react-loading-skeleton";
import { getRound } from "../../utils/primitives";

type SkeletonWrapperProps = {
    count?: number;
    height?: number;
    width?: number;
    borderRadius?: number;
    variant?: "default" | "table" | "bar-chart";
    showSkeleton: boolean;
    inline?: boolean;
    rows?: number;
    cols?: number;
    chartHeight?: number;
    chartName?: string;
    children: React.ReactNode;
};

const SkeletonWrapper = ({
    count = 1,
    height = 20,
    width,
    borderRadius,
    variant = "default",
    showSkeleton,
    inline = false,
    rows = 5,
    cols = 5,
    children,
    chartHeight = 360,
    chartName,
}: SkeletonWrapperProps) => {
    if (showSkeleton) {
        if (variant === "table") {
            return (
                <table className="w-full">
                    <tbody>
                        {[...Array(rows)].map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {[...Array(cols)].map((_, colIndex) => (
                                    <td key={colIndex} className="p-2 border">
                                        <Skeleton height={height} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (variant === "bar-chart") {
            return (
                <div>
                    {chartName && (
                        <p className="text-center text-gray-600 font-bold">
                            {chartName}
                        </p>
                    )}
                    <div
                        className={`mt-2 w-full flex gap-2 h-[${chartHeight}px] items-end justify-around border-b-2 border-gray-300 `}
                    >
                        {[...Array(count)].map((_, i) => (
                            <Skeleton
                                key={i}
                                width={width}
                                height={getRound(
                                    Math.random() *
                                        (chartHeight -
                                            getRound(chartHeight * 0.2)) +
                                        getRound(chartHeight * 0.2)
                                )}
                            />
                        ))}
                    </div>
                </div>
            );
        }

        // Default variant
        const skeletonElements = [];
        for (let i = 0; i < count; i++) {
            skeletonElements.push(
                <Skeleton
                    key={i}
                    height={height}
                    borderRadius={borderRadius}
                    inline={inline}
                    width={width}
                />
            );
        }
        return <div>{skeletonElements}</div>;
    }

    return <>{children}</>;
};

export default SkeletonWrapper;
