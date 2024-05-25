import React from "react";
import { TestItf } from "../../../types/types";

type SectionProps = {
    test: TestItf;
    onAfterUpdate: () => void;
    onBack: () => void;
    onNext: () => void;
};

const TestTakers = ({ test, onAfterUpdate, onBack, onNext }: SectionProps) => {
    return (
        <div className="px-20 py-12 shadow-2xl">
            <h2 className="text-center text-3xl">Test Takers</h2>

            <div className="flex justify-end items-center gap-3 mt-6 pt-4 border-t border-gray-300">
                <button
                    className="text-white bg-orange-600 px-12 py-1 disabled:bg-gray-500"
                    onClick={onBack}
                >
                    Back
                </button>
                <button
                    className="text-white bg-orange-600 px-12 py-1 hover:bg-orange-700 disabled:bg-gray-500"
                    onClick={onNext}
                    // disabled={!isNextable}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TestTakers;
