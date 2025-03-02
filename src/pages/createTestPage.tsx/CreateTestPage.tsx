import { useEffect } from "react";
import TestInfo from "./components/TestInfo";
import TestParts from "./components/TestParts";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "react-query";
import { getTest, publishTest } from "../../services/test";
import { TEST_STATUS } from "../../config/constants/tests";
import { toast } from "react-toastify";
import Button from "../../components/elements/Button";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/rootState";
import Navigator from "./components/Navigator";
import { CREATE_TEST_STEPS } from "../../config/constants/tests";
import {
    MUTATION_KEYS,
    QUERY_KEYS,
} from "../../config/constants/queryMutationKeys";
import { TOAST_MESSAGES } from "../../config/constants/toasts";
import TestQuestions from "./components/TestQuestions";
import TestAnswers from "./components/TestAnswers";
import TestTakers from "./components/TestTakers";
import { createTestActions } from "../../stores/createTest";
import { useDispatch } from "react-redux";
import Loading from "../../components/loadings/Loading";

const CreateTestPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const stepParam = searchParams.get("step");
    const { currentStep } = useSelector((state: RootState) => state.createTest);
    const navigate = useNavigate();
    const { setTestFromAPI, setStep, reset } = createTestActions;
    const dispatch = useDispatch();

    const { testId: testIdParam } = useParams();

    const {
        data: test,
        isLoading: isLoadingTest,
        refetch,
    } = useQuery({
        queryFn: async () => getTest(testIdParam!),
        queryKey: [QUERY_KEYS.GET_TEST, { testId: testIdParam }],
        enabled: false,
        onSuccess: (data) => {
            dispatch(setTestFromAPI(data?.test));
        },
    });

    const { mutate: publishTestMutate, isLoading: publishTestLoading } =
        useMutation({
            mutationFn: async () => {
                await publishTest(testIdParam!);
            },
            mutationKey: [
                MUTATION_KEYS.UPDATE_TEST,
                testIdParam,
                { body: { status: TEST_STATUS.PUBLISHED } },
            ],
            onSuccess: () => {
                toast.success(TOAST_MESSAGES.PUBLISHED_TEST_SUCCESSFULLY);
                navigate("/home");
                refetch();
            },
        });

    useEffect(() => {
        if (testIdParam) {
            refetch();
        }
    }, [testIdParam, refetch]);

    useEffect(() => {
        setSearchParams({ step: currentStep });
    }, [currentStep, setSearchParams]);

    useEffect(() => {
        if (!stepParam) {
            dispatch(setStep(CREATE_TEST_STEPS.TEST_INFORMATION));
        }
    }, [stepParam, dispatch, setStep]);

    // useEffect(() => {
    //     return () => {
    //         dispatch(reset());
    //     };
    // }, [dispatch, reset]);

    return (
        <>
            <Loading
                isLoading={isLoadingTest}
                loadingText={{ text: "Loading test..." }}
            />
            {((test && testIdParam) || (!test && !testIdParam)) && (
                <div className="xl:w-2/3 md:w-5/6 mx-auto py-10">
                    <Navigator />
                    <div className="2xl:w-3/5 w-4/5 mx-auto my-6 relative">
                        {test && test.status === TEST_STATUS.PUBLISHABLE && (
                            <div className="absolute top-0 left-0 w-full h-0 flex items-center justify-center">
                                <Button
                                    className=" uppercase"
                                    size="lg"
                                    onClick={() => publishTestMutate()}
                                    disabled={publishTestLoading}
                                >
                                    Publish test
                                </Button>
                            </div>
                        )}
                        {currentStep === CREATE_TEST_STEPS.TEST_INFORMATION && (
                            <TestInfo />
                        )}
                        {currentStep === CREATE_TEST_STEPS.TEST_PARTS && (
                            <TestParts />
                        )}
                        {currentStep === CREATE_TEST_STEPS.TEST_QUESTIONS && (
                            <TestQuestions />
                        )}
                        {currentStep === CREATE_TEST_STEPS.TEST_ANSWERS &&
                            test && <TestAnswers />}
                        {currentStep === CREATE_TEST_STEPS.TEST_TAKERS &&
                            test && <TestTakers />}
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateTestPage;
