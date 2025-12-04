import React from "react";
import { SubmissionItf } from "../../../types/types";
import Button from "../../../components/elements/Button";
import { getRound } from "../../../utils/primitives";
import SkeletonWrapper from "../../others/SkeletonWrapper";
import { shorten } from "../../../utils/text";

type Props = {
    submissions: SubmissionItf[];
    onViewMore: () => void;
    isLoading: boolean;
};

const TopTakers = ({ submissions, onViewMore, isLoading }: Props) => {
    return (
        <div className="bg-teal-50 border border-teal-500 border-dashed shrink-0 w-full md:w-[30%] flex flex-col">
            <p className="text-xl border-b p-2 border-dashed border-teal-500">
                Top takers
            </p>
            <div className="flex flex-col p-1 xl:p-2 h-full gap-2">
                <SkeletonWrapper showSkeleton={isLoading} count={5} height={40}>
                    {submissions.length > 0 && (
                        <div className="space-y-1 overflow-hidden">
                            {submissions.map((submission, index) => (
                                <div
                                    key={submission.id}
                                    className={`flex justify-start items-stretch bg-teal-500 text-white gap-2 shadow-sm`}
                                >
                                    <div className="bg-orange-500 text-white font-bold h-full px-2 xl:px-3 py-2 shrink-0 text-center">
                                        {index + 1}
                                    </div>
                                    <div className="text-nowrap px-1 py-2">
                                        {shorten(submission.taker.name, 15)}
                                    </div>
                                    <div className="ms-auto bg-white font-bold text-teal-500 h-full px-2 xl:px-3 py-2 shrink-0 w-[25%] text-center [clip-path:polygon(30%_0,_100%_0,_100%_100%,_0%_100%)]">
                                        {getRound(submission.score)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {!isLoading && submissions.length === 0 && (
                        <div className="text-gray-600 text-center mt-8">
                            No submissions found.
                        </div>
                    )}
                </SkeletonWrapper>
                {submissions.length > 0 && (
                    <div className="mt-auto">
                        <Button className="w-full" onClick={onViewMore}>
                            View more
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopTakers;
