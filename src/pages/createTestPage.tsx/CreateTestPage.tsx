import React, { useState } from "react";
import TestQuestions from "./components/TestQuestions";
import TestInfo from "./components/TestInfo";
import TestParts from "./components/TestParts";
import TestAnswers from "./components/TestAnswers";

const CreateTestPage = () => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

    return (
        <div className="xl:w-2/3 md:w-5/6 mx-auto py-10">
            <div className="flex w-3/4 mx-auto">
                {[1, 2, 3, 4].map((num) => {
                    return (
                        <div className="grow flex items-center" key={num}>
                            <div
                                className={`h-1 ${
                                    step >= num ? "bg-orange-600" : "bg-gray-300"
                                } grow`}
                            ></div>
                            <div
                                className={`w-8 h-8 ${
                                    step >= num ? "bg-orange-600" : "bg-gray-300"
                                } text-white rounded-full flex items-center justify-center text-xl`}
                            >
                                {num}
                            </div>
                            <div
                                className={`h-1 ${
                                    step >= num ? "bg-orange-600" : "bg-gray-300"
                                } grow`}
                            ></div>
                        </div>
                    );
                })}
            </div>
            <div className="2xl:w-3/5 w-4/5 mx-auto my-6">
                {step === 1 && (
                    <TestInfo
                        onNext={() => {
                            setStep(2);
                        }}
                    />
                )}
                {step === 2 && <TestParts />}
                {step === 3 && <TestQuestions />}
                {step === 4 && <TestAnswers />}
            </div>
        </div>
    );
};

export default CreateTestPage;
