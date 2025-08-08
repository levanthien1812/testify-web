import React from "react";
import { useAppSelector } from "../../../hooks/hooks";
import { getRound } from "../../../utils/primitives";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

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

const Statistics = () => {
    const { scores, rates, submissions } = useAppSelector(
        (state) => state.viewTest
    );

    return (
        <div className="flex flex-col gap-2 w-[20%] shrink-0">
            {scores && (
                <div className="border border-teal-500 border-dashed bg-teal-50">
                    <div className="p-2">
                        <p className="text-xl">Average score</p>
                        <p className="text-2xl font-bold text-teal-500">
                            {getRound(scores.average)}
                        </p>
                    </div>
                    <div className="border-t border-teal-500 border-dashed p-2">
                        <div className="flex gap-1">
                            <p>Highest score:</p>
                            <p className="font-bold text-teal-500">
                                {getRound(scores.highest)}
                            </p>
                            <UserIcon handleClick={() => {}} />
                        </div>
                        <div className="flex gap-1">
                            <p>Lowest score:</p>
                            <p className="font-bold text-teal-500">
                                {getRound(scores.lowest)}
                            </p>
                            <UserIcon handleClick={() => {}} />
                        </div>
                    </div>
                </div>
            )}

            <div className="border border-teal-500 border-dashed bg-teal-50">
                <div className="p-2">
                    <p className="text-xl">Total submissions</p>
                    <p className="text-2xl font-bold text-teal-500">
                        {getRound(submissions.length)}
                    </p>
                </div>
            </div>
            {rates && (
                <div className="border border-teal-500 border-dashed bg-teal-50">
                    <div className="p-2">
                        <p className="text-xl">Pass rate/Fail rate</p>
                        <div className="flex h-6 w-full mt-2">
                            <div
                                className="bg-teal-500 text-start text-white px-2"
                                style={{
                                    width: `${getRound(rates.pass) * 100}%`,
                                }}
                            >
                                {Math.round(rates.pass * 100)}%
                            </div>
                            <div
                                className="bg-orange-500 text-end text-white px-2"
                                style={{
                                    width: `${getRound(rates.fail) * 100}%`,
                                }}
                            >
                                {Math.round(rates.fail * 100)}%
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="border border-teal-500 border-dashed bg-teal-50 grow">
                <div className="p-2"></div>
            </div>
        </div>
    );
};

export default Statistics;
