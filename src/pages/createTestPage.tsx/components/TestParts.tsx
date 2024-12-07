import { useMutation } from "react-query";
import { validateParts } from "../../../services/test";
import Part from "./testParts/Part";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import Wrapper from "../../../components/wrappers/Wrapper";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import { createTestActions } from "../../../stores/createTest";
import { useDispatch } from "react-redux";

const TestParts = () => {
    const {
        numParts,
        numQuestions,
        maxScore,
        testId,
        testParts,
        isValidParts,
    } = useSelector((state: RootState) => state.createTest);
    const { moveNextStep, movePrevStep } = createTestActions;
    const dispatch = useDispatch();

    const { mutate: validatePartsMutate, isLoading: isValidatingParts } =
        useMutation({
            mutationFn: async () => await validateParts(testId!),
            mutationKey: [MUTATION_KEYS.CREATE_PARTS, { testId: testId }],
            onSuccess: (data) => {
                dispatch(moveNextStep());
            },
        });

    return (
        <Wrapper
            viewData={{
                headerTitle: { text: "Test Parts" },
                bottomButtons: {
                    containButton: {
                        text: "Next",
                        disabled: !isValidParts || isValidatingParts,
                        loadingText: "Validating...",
                        isLoading: isValidatingParts,
                        onClick: () => {
                            validatePartsMutate();
                        },
                    },
                    outlinedButton: {
                        onClick: () => {
                            dispatch(movePrevStep());
                        },
                        text: "Back",
                    },
                },
            }}
        >
            <div className="space-y-3 mt-4">
                <div className="flex gap-4">
                    <p>Total score: {maxScore}</p>
                    <p>Total questions: {numQuestions}</p>
                </div>
                {numParts > 1 &&
                    testParts.map((part, index) => (
                        <Part key={index} part={part} />
                    ))}
                {numParts === 1 && (
                    <div>
                        <p>
                            Your test doesn't have multiple parts so you can
                            skip this section
                        </p>
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default TestParts;
