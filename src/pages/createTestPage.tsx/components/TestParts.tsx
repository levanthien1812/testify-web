import { useMutation } from "react-query";
import { validateParts } from "../../../services/test";
import Part from "./testParts/Part";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import Wrapper from "../../../components/wrappers/Wrapper";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import { createTestActions } from "../../../stores/createTest";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

const TestParts = () => {
    const {
        numParts,
        numQuestions,
        maxScore,
        testId,
        testParts,
        isValidParts,
    } = useSelector((state: RootState) => state.createTest);
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
                {!isValidParts &&
                    <p className="text-orange-600">
                        <FontAwesomeIcon
                            icon={faCircleExclamation}
                            className="mr-2"
                        />
                        Total parts scores and questions must be equal to test score
                        and questions
                    </p>
                }
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
