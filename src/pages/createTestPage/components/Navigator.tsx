import { CreateTestStep } from "../../../types/tests";
import { ReactNode } from "react";

interface NavigatorProps {
    steps?: CreateTestStep[];
    currentStep: string | number;
    onStepClick: (step: string | number) => void;
}

const Navigator = ({ steps, currentStep, onStepClick }: NavigatorProps) => {
    const getColor = (step: CreateTestStep) => {
        if (currentStep === step.value) {
            return "bg-orange-600";
        } else if (step.isTotallyDone || step.isPartiallyDone) {
            return "bg-orange-400";
        } else {
            return "bg-gray-300";
        }
    };

    // If no steps provided, show simple numeric indicators
    if (!steps) {
        return (
            <div className="flex w-full sm:w-5/6 md:w-3/4 mx-auto bg-white p-2">
                <div className="grow flex items-center">
                    <div
                        className={`h-1 ${
                            currentStep === 1
                                ? "bg-orange-600"
                                : "bg-orange-400"
                        } grow`}
                    ></div>
                    <button
                        onClick={() => onStepClick(1)}
                        className={`w-8 h-8 ${
                            currentStep === 1
                                ? "bg-orange-600"
                                : "bg-orange-400"
                        } text-white rounded-full flex items-center justify-center text-xl`}
                    >
                        1
                    </button>
                    <div
                        className={`h-1 ${
                            currentStep === 2
                                ? "bg-orange-600"
                                : "bg-orange-400"
                        } grow`}
                    ></div>
                    <button
                        onClick={() => onStepClick(2)}
                        className={`w-8 h-8 ${
                            currentStep === 2
                                ? "bg-orange-600"
                                : "bg-orange-400"
                        } text-white rounded-full flex items-center justify-center text-xl`}
                    >
                        2
                    </button>
                    <div
                        className={`h-1 ${
                            currentStep === 2 ? "bg-orange-600" : "bg-gray-300"
                        } grow`}
                    ></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full sm:w-5/6 md:w-3/4 mx-auto bg-white p-2">
            {steps.map((step) => {
                return (
                    <div className="grow flex items-center" key={step.value}>
                        <div className={`h-1 ${getColor(step)} grow`}></div>
                        <button
                            onClick={() => onStepClick(step.value)}
                            className={`w-8 h-8 ${getColor(
                                step,
                            )} text-white rounded-full flex items-center justify-center text-xl`}
                        >
                            {step.index}
                        </button>
                        <div className={`h-1 ${getColor(step)} grow`}></div>
                    </div>
                );
            })}
        </div>
    );
};

export default Navigator;
