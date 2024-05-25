import React, { useEffect, useState } from "react";
import TestQuestions from "./components/TestQuestions";
import TestInfo from "./components/TestInfo";
import TestParts from "./components/TestParts";
import TestAnswers from "./components/TestAnswers";
import { TestItf } from "../../types/types";
import { useParams } from "react-router";
import { useQuery } from "react-query";
import { getTest } from "../../services/test";
import { generateArray } from "../../utils/array";
import TestTakers from "./components/TestTakers";

const CreateTestPage = () => {
    const [test, setTest] = useState<TestItf | null>(null);
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

    const { testId: testIdParam } = useParams();
    const [testId, setTestId] = useState<string | undefined>(testIdParam);

    const { data, isFetching, refetch } = useQuery({
        queryFn: async () => {
            const res = await getTest(testId!);
            return res.test;
        },
        queryKey: [`get-test`, { testId }],
        enabled: false,
    });

    useEffect(() => {
        if (testId) {
            refetch();
        }
    }, [testId]);

    useEffect(() => {
        if (data) {
            setTest(data);
        } else setTest(null);
    }, [data]);

    return (
        <div className="xl:w-2/3 md:w-5/6 mx-auto py-10">
            <div className="flex w-3/4 mx-auto">
                {[...Array(5)].map((num, index) => {
                    return (
                        <div className="grow flex items-center" key={index}>
                            <div
                                className={`h-1 ${
                                    step >= index + 1
                                        ? step === index + 1
                                            ? "bg-orange-600"
                                            : "bg-orange-400"
                                        : "bg-gray-300"
                                } grow`}
                            ></div>
                            <div
                                className={`w-8 h-8 ${
                                    step >= index + 1
                                        ? step === index + 1
                                            ? "bg-orange-600"
                                            : "bg-orange-400"
                                        : "bg-gray-300"
                                } text-white rounded-full flex items-center justify-center text-xl`}
                            >
                                {index + 1}
                            </div>
                            <div
                                className={`h-1 ${
                                    step >= index + 1
                                        ? step === index + 1
                                            ? "bg-orange-600"
                                            : "bg-orange-400"
                                        : "bg-gray-300"
                                } grow`}
                            ></div>
                        </div>
                    );
                })}
            </div>
            <div className="2xl:w-3/5 w-4/5 mx-auto my-6">
                {step === 1 && (
                    <TestInfo
                        test={test}
                        onNext={() => setStep(2)}
                        onBack={() => {}}
                        onAfterUpdate={(id) => setTestId(id)}
                    />
                )}
                {step === 2 && test && (
                    <TestParts
                        test={test}
                        onBack={() => setStep(1)}
                        onNext={() => setStep(3)}
                        onAfterUpdate={() => refetch()}
                    />
                )}
                {step === 3 && test && (
                    <TestQuestions
                        test={test}
                        onAfterUpdate={() => refetch()}
                        onBack={() => setStep(2)}
                        onNext={() => setStep(4)}
                    />
                )}
                {step === 4 && test && (
                    <TestAnswers
                        test={test}
                        onAfterUpdate={() => refetch()}
                        onBack={() => setStep(3)}
                        onNext={() => setStep(5)}
                    />
                )}
                {step === 5 && test && (
                    <TestTakers
                        test={test}
                        onAfterUpdate={() => refetch()}
                        onBack={() => setStep(4)}
                        onNext={() => setStep(5)}
                    />
                )}
            </div>
        </div>
    );
};

export default CreateTestPage;
