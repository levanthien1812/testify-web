import Answer from "./testAnswers/Answer";
import Questions from "./testQuestions/Questions";
import Wrapper from "../../../components/wrappers/Wrapper";
import { createTestActions } from "../../../stores/createTest";
import { useDispatch } from "react-redux";
import { TestItf } from "../../../types/types";
import { useAppSelector } from "../../../hooks/hooks";

const TestAnswers = () => {
    const { moveNextStep, movePrevStep } = createTestActions;
    const { numParts, testParts, testQuestions } = useAppSelector(
        (state) => state.createTest
    );
    const dispatch = useDispatch();

    return (
        <Wrapper
            viewData={{
                headerTitle: {
                    text: "Test Answers",
                    description: {
                        text: "You can skip this section and provide answers later",
                    },
                },
                bottomButtons: {
                    containButton: {
                        text: "Next",
                        onClick: () => {
                            dispatch(moveNextStep());
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
            <div className={`space-y-3 mt-4`}>
                {numParts > 1 &&
                    testParts.map((part) => (
                        <Questions part={part} withAnswer={true} />
                    ))}
                {numParts <= 1 && (
                    <div className={`px-4 py-4 space-y-2`}>
                        {testQuestions.map((question) => (
                            <Answer question={question} key={question.id} />
                        ))}
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default TestAnswers;
