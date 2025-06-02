import Questions from "./testQuestions/Questions";
import { validateQuestions } from "../../../services/test";
import { useMutation } from "react-query";
import Wrapper from "../../../components/wrappers/Wrapper";
import { createTestActions } from "../../../stores/createTest";
import { useDispatch } from "react-redux";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import InfoMessage from "../../../components/elements/InfoMessage";
import { useEffect } from "react";
import { useAppSelector } from "../../../hooks/hooks";

const TestQuestions = () => {
    const { testId, testParts, isValidQuestions } = useAppSelector(
        (state) => state.createTest
    );
    const { moveNextStep, movePrevStep, validate, initializeTestQuestions } =
        createTestActions;
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
        dispatch(initializeTestQuestions());
        dispatch(validate());
    }, [validate, dispatch, initializeTestQuestions]);

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
                <InfoMessage
                    message="Make sure all questions info are provided and total questions scores is equal to test/part score"
                    type="warning"
                />
            )}
            <InfoMessage message="Drag to reorder questions" type="info" />
            <div className="space-y-3 mt-4">
                {testParts.length > 1 &&
                    testParts.map(
                        (part) =>
                            part.questions!.length > 0 && (
                                <Questions part={part} key={part.name} />
                            )
                    )}
                {testParts.length <= 1 && <Questions />}
            </div>
        </Wrapper>
    );
};

export default TestQuestions;
