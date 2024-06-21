import React, { useEffect, useState } from "react";
import TestQuestions from "./components/TestQuestions";
import TestInfo from "./components/TestInfo";
import TestParts from "./components/TestParts";
import TestAnswers from "./components/TestAnswers";
import { TestItf } from "../../types/types";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "react-query";
import { getTest, publishTest, updateTest } from "../../services/test";
import TestTakers from "./components/TestTakers";
import { testStatus } from "../../config/config";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const CreateTestPage = () => {
    const [test, setTest] = useState<TestItf | null>(null);
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
    const navigate = useNavigate();

    const { testId: testIdParam } = useParams();
    const [testId, setTestId] = useState<string | undefined>(testIdParam);

    const { data, isLoading, refetch } = useQuery({
        queryFn: async () => {
            const res = await getTest(testId!);
            return res.test;
        },
        queryKey: [`get-test`, { testId }],
        enabled: false,
    });

    const { mutate: publishTestMutate, isLoading: publishTestLoading } =
        useMutation({
            mutationFn: async () => {
                await publishTest(testId!);
            },
            mutationKey: [
                `update-test`,
                testId,
                { body: { status: testStatus.PUBLISHED } },
            ],
            onSuccess: () => {
                toast.success("Test published");
                navigate("/home");
                refetch();
            },
            onError: (err) => {
                if (err instanceof AxiosError) {
                    toast.error(err.response?.data.message);
                }
            },
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
            <div className="2xl:w-3/5 w-4/5 mx-auto my-6 relative">
                {test && test.status === testStatus.PUBLISHABLE && (
                    <div className="absolute top-0 left-0 w-full h-0 flex items-center justify-center">
                        <button
                            className="bg-orange-600 hover:bg-orange-700 shadow-md text-white px-8 py-1 rounded-full uppercase disabled:bg-gray-600"
                            onClick={() => publishTestMutate()}
                            disabled={publishTestLoading}
                        >
                            Publish test
                        </button>
                    </div>
                )}
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
                        onAfterUpdate={async () => await refetch()}
                    />
                )}
                {step === 3 && test && (
                    <TestQuestions
                        test={test}
                        onBack={() => setStep(2)}
                        onNext={() => setStep(4)}
                        onAfterUpdate={async () => await refetch()}
                    />
                )}
                {step === 4 && test && (
                    <TestAnswers
                        test={test}
                        onBack={() => setStep(3)}
                        onNext={() => setStep(5)}
                        onAfterUpdate={async () => await refetch()}
                    />
                )}
                {step === 5 && test && (
                    <TestTakers
                        test={test}
                        onBack={() => setStep(4)}
                        onNext={() => setStep(5)}
                        onAfterUpdate={async () => await refetch()}
                    />
                )}
            </div>
        </div>
    );
};

export default CreateTestPage;
