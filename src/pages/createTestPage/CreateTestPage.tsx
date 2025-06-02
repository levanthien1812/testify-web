import { useEffect } from "react";
import TestInfo from "./components/TestInfo";
import TestParts from "./components/TestParts";
import { useParams } from "react-router";
import { useQuery } from "react-query";
import { getTest } from "../../services/test";
import { useSearchParams } from "react-router-dom";
import Navigator from "./components/Navigator";
import { CREATE_TEST_STEPS } from "../../config/constants/tests";
import { QUERY_KEYS } from "../../config/constants/queryMutationKeys";
import TestQuestions from "./components/TestQuestions";
import TestAnswers from "./components/TestAnswers";
import TestTakers from "./components/TestTakers";
import { createTestActions } from "../../stores/createTest";
import { useDispatch } from "react-redux";
import Loading from "../../components/loadings/Loading";
import StatusPanel from "./components/StatusPanel";
import { useAppSelector } from "../../hooks/hooks";

const CreateTestPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const stepParam = searchParams.get("step");
    const { currentStep } = useAppSelector((state) => state.createTest);
    const { setTestFromAPI, setStep, reset } = createTestActions;
    const dispatch = useDispatch();

    const { testId: testIdParam } = useParams();

    const {
        data: test,
        isLoading: isLoadingTest,
        refetch,
    } = useQuery({
        queryFn: async () => {
            const responseData = await getTest(testIdParam!);
            return responseData;
        },
        queryKey: [QUERY_KEYS.GET_TEST, { testId: testIdParam }],
        enabled: false,
        onSuccess: (data) => {
            dispatch(setTestFromAPI(data));
        },
    });

    useEffect(() => {
        if (testIdParam) {
            refetch();
        } else {
            dispatch(createTestActions.reset());
        }
    }, [testIdParam, refetch, dispatch]);

    useEffect(() => {
        setSearchParams({ step: currentStep });
    }, [currentStep, setSearchParams]);

    useEffect(() => {
        if (!stepParam) {
            dispatch(setStep(CREATE_TEST_STEPS.TEST_INFORMATION));
        }
    }, [stepParam, dispatch, setStep]);

    return (
        <>
            <Loading
                isLoading={isLoadingTest}
                loadingText={{ text: "Loading test..." }}
            />
            {((test && testIdParam) || (!test && !testIdParam)) && (
                <div className="xl:w-2/3 md:w-5/6 mx-auto py-10">
                    <Navigator />
                    <StatusPanel />
                    <div className="2xl:w-3/5 w-4/5 mx-auto my-6 relative">
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
