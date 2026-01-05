import { useState, useEffect } from "react";
import Joyride, { CallBackProps, Step, STATUS } from "react-joyride";
import { useAppSelector } from "../../../hooks/hooks";
import { CREATE_TEST_STEPS } from "../../../config/constants/tests";

export const joyrideStyles = {
    options: {
        primaryColor: "#ea580c",
        zIndex: 10000,
    },
    buttonBack: {
        color: "#ea580c",
        border: "1px solid #ea580c",
        backgroundColor: "white",
        padding: "6px 8px",
    },
    buttonNext: {
        border: "1px solid #ea580c",
        borderRadius: 0,
        padding: "6px 8px",
    },
    tooltip: {
        borderRadius: "0px",
    },
};

const CreateTestTour = () => {
    const { currentStep } = useAppSelector((state) => state.createTest);
    const [run, setRun] = useState(false);
    const [steps, setSteps] = useState<Step[]>([]);

    const tourKey = `createTestTour_${currentStep}_viewed`;

    useEffect(() => {
        const tourViewed = localStorage.getItem(tourKey);
        let newSteps: Step[] = [];

        switch (currentStep) {
            case CREATE_TEST_STEPS.TEST_INFORMATION:
                newSteps = testInfoSteps;
                break;
            case CREATE_TEST_STEPS.TEST_PARTS:
                newSteps = testPartsSteps;
                break;
            case CREATE_TEST_STEPS.TEST_QUESTIONS:
                newSteps = testQuestionsSteps;
                break;
            case CREATE_TEST_STEPS.TEST_ANSWERS:
                newSteps = testAnswersSteps;
                break;
            case CREATE_TEST_STEPS.TEST_TAKERS:
                newSteps = testSharingSteps;
                break;
            default:
                newSteps = [];
        }

        setSteps(newSteps);

        if (!tourViewed && newSteps.length > 0) {
            setRun(true);
        } else {
            setRun(false);
        }
    }, [currentStep, tourKey]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem(tourKey, "true");
        }
    };

    const testInfoSteps: Step[] = [
        {
            target: "body",
            placement: "center",
            title: "Let's Create a Test!",
            content:
                "This guide will walk you through the steps of creating a new test.",
            disableBeacon: true,
        },
        {
            target: "#test-info-section",
            content:
                "First, fill in the basic information about your test here, like title, duration, and instructions.",
            placement: "bottom",
        },
        {
            target: "#test-options-section",
            content:
                "You can configure advanced options for your test here, such as shuffling questions or setting a close time.",
            placement: "bottom",
        },
        {
            target: "#navigator-panel",
            content: (
                <div>
                    <p>This shows the 5 steps of test creation:</p>
                    <ol className="list-decimal list-inside">
                        <li>Test Information</li>
                        <li>Test Parts</li>
                        <li>Test Questions</li>
                        <li>Test Answers</li>
                        <li>Test Sharing</li>
                    </ol>
                    <p className="mt-2">
                        Use this to navigate between completed steps.
                    </p>
                </div>
            ),
            placement: "top",
        },
    ];

    const testPartsSteps: Step[] = [
        {
            target: "#test-parts-section",
            content: (
                <div>
                    <p>
                        You can divide your test into multiple parts, each with
                        its own set of questions. This is optional.
                    </p>
                    <p className="mt-2">
                        <strong>Important:</strong> The total score of all parts
                        must equal the test's total score.
                    </p>
                </div>
            ),
            placement: "bottom",
        },
    ];

    const testQuestionsSteps: Step[] = [
        {
            target: "#test-questions-section",
            content: (
                <div>
                    <p>
                        Add questions to your test. You can create new ones or
                        import them from your question banks.
                    </p>
                    <p className="mt-2">
                        <strong>Note:</strong> The total score of all questions
                        must equal the score of the test (or the part they
                        belong to).
                    </p>
                </div>
            ),
            placement: "bottom",
        },
        {
            target: "#question-list",
            content: (
                <div className="text-left">
                    <p>We support a variety of question types:</p>
                    <ul className="list-disc list-inside mt-2">
                        <li>Multiple Choices</li>
                        <li>Fill in the Gaps</li>
                        <li>Matching</li>
                        <li>True/False</li>
                        <li>Response (essay)</li>
                    </ul>
                    <p className="mt-2">
                        Click on a question to start editing and choose its
                        type!
                    </p>
                </div>
            ),
        },
    ];

    const testAnswersSteps: Step[] = [
        {
            target: "#test-answers-section",
            content: (
                <div>
                    <p>
                        Set the correct answers and scores for each question.
                        This is crucial for automatic grading.
                    </p>
                    <p className="mt-2">
                        You can also add explanations for the correct answers
                        and ask AI to assist you in answering.
                    </p>
                </div>
            ),
            placement: "bottom",
        },
    ];

    const testSharingSteps: Step[] = [
        {
            target: "#test-sharing-section",
            content: (
                <div>
                    <p>
                        Finally, share your test. You can restrict access to
                        specific emails, use a passcode, or make it public with
                        a link.
                    </p>
                </div>
            ),
            placement: "bottom",
        },
        {
            target: "#status-panel",
            content:
                "When you're ready, publish the test to make it available for takers.",
            placement: "bottom",
        },
    ];

    return (
        <Joyride
            steps={steps}
            run={run}
            callback={handleJoyrideCallback}
            continuous
            showProgress
            showSkipButton
            styles={joyrideStyles}
        />
    );
};

export default CreateTestTour;
