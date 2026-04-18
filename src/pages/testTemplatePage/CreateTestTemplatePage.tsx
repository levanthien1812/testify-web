import { useEffect, useState } from "react";
import CreateTestTemplate from "./components/CreateTestTemplate";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "react-query";
import { QUERY_KEYS } from "../../config/constants/queryMutationKeys";
import { createTestTemplateActions } from "../../stores/createTestTemplate";
import { useDispatch } from "react-redux";
import Loading from "../../components/loadings/Loading";
import { useAppSelector } from "../../hooks/hooks";
import { AxiosError } from "axios";
import MessageAction from "../others/MessageAction";
import { getTestTemplate } from "../../services/testTemplate";
import Navigator from "../createTestPage/components/Navigator";
import { CREATE_TEST_TEMPLATE_STEPS } from "../../config/constants/testTemplate";
import { date } from "joi";

const CreateTestTemplatePage = () => {
    const { numParts, currentStep, steps } = useAppSelector(
        (state) => state.createTestTemplate,
    );
    const [error, setError] = useState<string | null>(null);
    const {
        setTemplateFromAPI,
        reset,
        navigateStep,
        validate,
        initializeTemplateParts,
    } = createTestTemplateActions;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { templateId: testIdParam } = useParams();

    const {
        data: testTemplate,
        isLoading: isLoadingTestTemplate,
        refetch,
    } = useQuery({
        queryFn: async () => {
            const responseData = await getTestTemplate(testIdParam!);
            return responseData;
        },
        queryKey: [QUERY_KEYS.GET_TEST_TEMPLATE, { templateId: testIdParam }],
        enabled: false,
        onSuccess: (data) => {
            dispatch(setTemplateFromAPI(data));
            dispatch(validate());
        },
        onError: (err: any) => {
            if (err instanceof AxiosError) {
                setError(err.response?.data.message);
            }
        },
    });

    useEffect(() => {
        if (testIdParam) {
            refetch();
        }
    }, [testIdParam, refetch]);

    useEffect(() => {
        return () => {
            dispatch(reset());
        };
    }, [dispatch, reset]);

    return (
        <>
            <Loading
                isLoading={isLoadingTestTemplate}
                loadingText={{ text: "Loading test template..." }}
            />
            {error && !isLoadingTestTemplate && (
                <MessageAction
                    message={{
                        text: error,
                    }}
                    actions={{
                        primary: {
                            text: "Back to home",
                            onClick: () => navigate("/"),
                        },
                    }}
                />
            )}
            {((testTemplate && testIdParam) ||
                (!testTemplate && !testIdParam)) && (
                <div className="xl:w-2/3 md:w-5/6 mx-auto py-2 sm:py-4 md:py-10 px-2">
                    <div id="navigator-panel">
                        <Navigator
                            steps={steps}
                            currentStep={currentStep}
                            onStepClick={(step) =>
                                dispatch(
                                    navigateStep(
                                        step as CREATE_TEST_TEMPLATE_STEPS,
                                    ),
                                )
                            }
                        />
                    </div>
                    <div className="2xl:w-2/3 mx-auto my-2 md:my-6 relative">
                        <CreateTestTemplate />
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateTestTemplatePage;
