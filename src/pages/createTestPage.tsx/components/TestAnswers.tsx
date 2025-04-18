import Answer from "./testAnswers/Answer";
import Questions from "./testQuestions/Questions";
import Wrapper from "../../../components/wrappers/Wrapper";
import { createTestActions } from "../../../stores/createTest";
import { useDispatch } from "react-redux";
import { TestItf } from "../../../types/types";

const TestAnswers = ({ test }: { test: TestItf }) => {
    const { moveNextStep, movePrevStep } = createTestActions;
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
                {test &&
                    test.parts.length > 0 &&
                    test.parts.map((part) => (
                        <Questions part={part} withAnswer={true} />
                    ))}
                {test && test.parts.length === 0 && (
                    <div className={`px-4 py-4 space-y-2`}>
                        {test.questions!.map((question) => (
                            <Answer question={question} key={question.id} />
                        ))}
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default TestAnswers;
