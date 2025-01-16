import Answer from "./testAnswers/Answer";
import Questions from "./testQuestions/Questions";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import Wrapper from "../../../components/wrappers/Wrapper";
import { createTestActions } from "../../../stores/createTest";
import { useDispatch } from "react-redux";

const TestAnswers = () => {
    const { testParts, testQuestions } = useSelector(
        (state: RootState) => state.createTest
    );
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
                {testParts.length > 0 &&
                    testParts.map((part) => (
                        <Questions part={part} withAnswer={true} />
                    ))}
                {testParts.length === 0 && (
                    <div className={`px-4 py-4 space-y-2`}>
                        {testQuestions!.map((question) => (
                            <Answer question={question} key={question.id} />
                        ))}
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default TestAnswers;
