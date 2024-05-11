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

const CreateTestPage = () => {
    const [test, setTest] = useState<TestItf | null>(null);
    const [numParts, setNumParts] = useState<number>(1);
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

    const { testId } = useParams();

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
            if (data.parts.length > 1) {
                setNumParts(data.parts.length);
            }
        } else setTest(null);
    }, [data]);

    useEffect(() => {
        if (numParts > 1 && step === 2) {
            if (test && test.parts.length === 0) {
                const nums = generateArray(numParts);

                const initParts = nums.map((num) => {
                    return {
                        order: num,
                        name: "",
                        description: "",
                        num_questions: 0,
                        score: 0,
                    };
                });

                setTest({ ...test, parts: initParts });
            }
        }
    }, [numParts, step]);

    return (
        <div className="xl:w-2/3 md:w-5/6 mx-auto py-10">
            <div className="flex w-3/4 mx-auto">
                {[1, 2, 3, 4].map((num) => {
                    return (
                        <div className="grow flex items-center" key={num}>
                            <div
                                className={`h-1 ${
                                    step >= num
                                        ? "bg-orange-600"
                                        : "bg-gray-300"
                                } grow`}
                            ></div>
                            <div
                                className={`w-8 h-8 ${
                                    step >= num
                                        ? "bg-orange-600"
                                        : "bg-gray-300"
                                } text-white rounded-full flex items-center justify-center text-xl`}
                            >
                                {num}
                            </div>
                            <div
                                className={`h-1 ${
                                    step >= num
                                        ? "bg-orange-600"
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
                        setTest={setTest}
                        numParts={numParts}
                        setNumParts={setNumParts}
                        onNext={() => setStep(2)}
                    />
                )}
                {step === 2 && test && numParts && numParts > 1 && (
                    <TestParts
                        test={test}
                        setTest={setTest}
                        numParts={numParts}
                        onBack={() => setStep(1)}
                        onNext={() => setStep(3)}
                    />
                )}
                {step === 3 && test && (
                    <TestQuestions
                        test={test}
                        setTest={setTest}
                        onBack={() => setStep(2)}
                        onNext={() => setStep(4)}
                    />
                )}
                {step === 4 && <TestAnswers />}
            </div>
        </div>
    );
};

export default CreateTestPage;
