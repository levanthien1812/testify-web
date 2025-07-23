import { useMutation } from "react-query";
import { validateParts } from "../../../services/test";
import Part from "./testParts/Part";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import Wrapper from "./Wrapper";
import { createTestActions } from "../../../stores/createTest";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import InfoMessage from "../../../components/elements/InfoMessage";
import { useAppSelector } from "../../../hooks/hooks";

const TestParts = () => {
    const {
        numParts,
        numQuestions,
        maxScore,
        testId,
        testParts,
        isValidParts,
    } = useAppSelector((state) => state.createTest);
    const { moveNextStep, movePrevStep, validate } = createTestActions;
    const dispatch = useDispatch();

    const { mutate: validatePartsMutate, isLoading: isValidatingParts } =
        useMutation({
            mutationFn: async () => await validateParts(testId!),
            mutationKey: [MUTATION_KEYS.CREATE_PARTS, { testId: testId }],
            onSuccess: (data) => {
                dispatch(moveNextStep());
            },
        });

    useEffect(() => {
        dispatch(validate());
    }, [dispatch, validate]);

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
                canOpenParts: true,
            }}
        >
            <div className="space-y-3 mt-4">
                <div className="flex gap-4">
                    <p>
                        Total score:{" "}
                        <span className="font-bold">{maxScore}</span>{" "}
                    </p>
                    <p>
                        Total questions:{" "}
                        <span className="font-bold">{numQuestions}</span>
                    </p>
                </div>
                {!isValidParts && (
                    <InfoMessage
                        message="
                        Total parts scores and questions must be equal to test score
                        and questions"
                        type="warning"
                    />
                )}
                {numParts > 1 &&
                    testParts.map((part, index) => (
                        <Part key={part.id || index} part={part} />
                    ))}
                {numParts === 0 && (
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
