import Questions from "./testQuestions/Questions";
import { validateQuestions } from "../../../services/test";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import Wrapper from "../../../components/wrappers/Wrapper";
import { createTestActions } from "../../../stores/createTest";
import { useDispatch } from "react-redux";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import ErrorInfo from "../../../components/errors/ErrorInfo";
import { useEffect } from "react";

const TestQuestions = () => {
    const { testId, testParts, isValidQuestions } = useSelector(
        (state: RootState) => state.createTest
    );
    const { moveNextStep, movePrevStep, validate } = createTestActions;
    const dispatch = useDispatch();

    const {
        mutate: validateQuestionsMutate,
        isLoading: isValidatingQuestions,
    } = useMutation({
        mutationFn: async () => {
            return await validateQuestions(testId!);
        },
        mutationKey: [MUTATION_KEYS.VALIDATE_QUESTIONS, { testId }],
        onSuccess: () => {
            dispatch(moveNextStep());
        },
    });

    useEffect(() => {
        dispatch(validate());
    }, [validate, dispatch]);

    return (
        <Wrapper
            viewData={{
                headerTitle: { text: "Questions" },
                bottomButtons: {
                    containButton: {
                        text: "Next",
                        disabled: !isValidQuestions || isValidatingQuestions,
                        loadingText: "Validating...",
                        isLoading: isValidatingQuestions,
                        onClick: () => {
                            validateQuestionsMutate();
                        },
                    },
                    outlinedButton: {
                        text: "Back",
                        onClick: () => {
                            dispatch(movePrevStep());
                        },
                    },
                },
            }}
        >
            {!isValidQuestions && (
                <ErrorInfo message="Make sure all questions info are provided and total questions scores is equal to test/part score" />
            )}
            <div className="space-y-3 mt-4">
                {testParts.length > 0 &&
                    testParts.map(
                        (part) =>
                            part.questions!.length > 0 && (
                                <Questions part={part} key={part.name} />
                            )
                    )}
                {testParts.length === 0 && <Questions />}
            </div>
        </Wrapper>
    );
};

export default TestQuestions;
