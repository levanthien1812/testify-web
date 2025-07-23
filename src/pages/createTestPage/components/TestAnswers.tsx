import Answer from "./testAnswers/Answer";
import Questions from "./testQuestions/Questions";
import Wrapper from "./Wrapper";
import { createTestActions } from "../../../stores/createTest";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/hooks";
import { useEffect } from "react";

const TestAnswers = () => {
    const { moveNextStep, movePrevStep, initializeTestAnswers } =
        createTestActions;
    const { numParts, testParts, testQuestions } = useAppSelector(
        (state) => state.createTest
    );
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeTestAnswers());
    }, [dispatch, initializeTestAnswers]);

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
                canOpenParts: true,
            }}
        >
            <div className={`space-y-3 mt-4`}>
                {numParts > 1 &&
                    testParts.map((part) => (
                        <Questions part={part} withAnswer={true} />
                    ))}
                {numParts === 0 && (
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
