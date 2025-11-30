import React from "react";
import { useAppSelector } from "../../../hooks/hooks";
import { getNum, getRound } from "../../../utils/primitives";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import SkeletonWrapper from "../../others/SkeletonWrapper";
import "react-loading-skeleton/dist/skeleton.css";
import { formatTime } from "../../../utils/time";

const UserIcon = ({ handleClick }: { handleClick: () => void }) => {
    return (
        <button
            className="bg-white shadow-sm shadow-gray-300 rounded-full p-0.5 w-5 h-5 flex justify-center items-center"
            onClick={handleClick}
        >
            <FontAwesomeIcon
                icon={faUser}
                className="text-gray-600 text-[11px] m-auto"
            />
        </button>
    );
};

const Statistics = ({ isLoading }: { isLoading: boolean }) => {
    const { scores, rates, averageTime, submissions } = useAppSelector(
        (state) => state.viewTest
    );

    return (
        <div className="flex flex-col gap-2 w-full md:w-[20%] shrink-0">
            <div className="border border-teal-500 border-dashed bg-teal-50">
                <div className="p-2 flex flex-row md:flex-col gap-2 md:gap-0">
                    <p className="text-xl">Average score:</p>
                    <SkeletonWrapper showSkeleton={isLoading}>
                        <p className="text-2xl font-bold text-teal-500">
                            {getRound(scores?.average)}
                        </p>
                    </SkeletonWrapper>
                </div>
                <div className="border-t border-teal-500 border-dashed p-2">
                    <div className="flex gap-1">
                        <p>Highest score:</p>
                        <SkeletonWrapper
                            showSkeleton={isLoading}
                            inline
                            width={30}
                        >
                            <p className="font-bold text-teal-500">
                                {getRound(scores?.highest)}
                            </p>
                        </SkeletonWrapper>
                        <UserIcon handleClick={() => {}} />
                    </div>
                    <div className="flex gap-1">
                        <p>Lowest score:</p>
                        <SkeletonWrapper
                            showSkeleton={isLoading}
                            inline
                            width={30}
                        >
                            <p className="font-bold text-teal-500">
                                {getRound(scores?.lowest)}
                            </p>
                        </SkeletonWrapper>
                        <UserIcon handleClick={() => {}} />
                    </div>
                </div>
            </div>

            <div className="border border-teal-500 border-dashed bg-teal-50">
                <div className="p-2 flex flex-row md:flex-col gap-2 md:gap-0">
                    <p className="text-xl">Total submissions:</p>
                    {!isLoading && (
                        <p className="text-2xl font-bold text-teal-500">
                            {getRound(submissions.length)}
                        </p>
                    )}
                    {isLoading && <Skeleton />}
                </div>
            </div>

            <div className="border border-teal-500 border-dashed bg-teal-50">
                <div className="p-2">
                    <p className="text-xl">Pass rate/Fail rate:</p>
                    <SkeletonWrapper showSkeleton={isLoading}>
                        <div className="flex h-6 w-full mt-2">
                            <div
                                className="bg-teal-500 text-start text-white px-2"
                                style={{
                                    width: `${getRound(rates?.pass) * 100}%`,
                                }}
                            >
                                {Math.round(getRound(rates?.pass) * 100)}%
                            </div>
                            <div
                                className="bg-orange-500 text-end text-white px-2"
                                style={{
                                    width: `${getRound(rates?.fail) * 100}%`,
                                }}
                            >
                                {Math.round(getRound(rates?.fail) * 100)}%
                            </div>
                        </div>
                    </SkeletonWrapper>
                </div>
            </div>

            <div className="border border-teal-500 border-dashed bg-teal-50 grow">
                <div className="p-2 flex flex-row md:flex-col gap-2 md:gap-0">
                    <p className="text-xl">Average time:</p>
                    <SkeletonWrapper showSkeleton={isLoading}>
                        <p className="text-2xl font-bold text-teal-500">
                            {formatTime(averageTime || 0)}
                        </p>
                    </SkeletonWrapper>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
