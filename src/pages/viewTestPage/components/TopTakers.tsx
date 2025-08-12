import React from "react";
import { SubmissionItf } from "../../../types/types";
import Button from "../../../components/elements/Button";
import { getRound } from "../../../utils/primitives";

type Props = {
    submissions: SubmissionItf[];
    onViewMore: () => void;
};

const TopTakers = ({ submissions, onViewMore }: Props) => {
    return (
        <div className="bg-teal-50 border border-teal-500 border-dashed shrink-0 w-full md:w-[30%] flex flex-col">
            <p className="text-xl border-b p-2 border-dashed border-teal-500">
                Top takers
            </p>
            <div className="space-y-1 p-1 xl:p-2 overflow-hidden">
                {submissions.map((submission, index) => (
                    <div
                        key={submission.id}
                        className={`flex justify-between items-stretch bg-teal-500 text-white gap-2 shadow-sm`}
                    >
                        <div className="bg-orange-500 text-white font-bold h-full px-2 xl:px-3 py-2 shrink-0 text-center">
                            {index + 1}
                        </div>
                        <p className="text-nowrap px-1 xl:px-2 py-2">
                            {submission.taker.name}
                        </p>
                        <div className="bg-white font-bold text-teal-500 h-full px-2 xl:px-3 py-2 shrink-0 w-[25%] text-center [clip-path:polygon(30%_0,_100%_0,_100%_100%,_0%_100%)]">
                            {getRound(submission.score)}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-2 mt-auto">
                <Button className="w-full" onClick={onViewMore}>
                    View more
                </Button>
            </div>
        </div>
    );
};

export default TopTakers;
