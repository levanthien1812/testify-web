import { useState, useEffect } from "react";
import Joyride, { CallBackProps, Step, STATUS } from "react-joyride";
import { useAppSelector } from "../../../hooks/hooks";
import { ROLES } from "../../../config/constants/tests";
import { joyrideStyles } from "../../createTestPage/components/CreateTestTour";

const OnboardingTour = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [runTour, setRunTour] = useState(false);

    useEffect(() => {
        const tourViewed = localStorage.getItem("homePageTourViewed");
        if (!tourViewed) {
            setRunTour(true);
        }
    }, []);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRunTour(false);
            localStorage.setItem("homePageTourViewed", "true");
        }
    };

    const baseSteps: Step[] = [
        {
            target: "body",
            placement: "center",
            title: "Welcome to Testify!",
            content: "Let's take a quick tour to get you started.",
            disableBeacon: true,
        },
        {
            target: "#test-calendar",
            content: "Here you can see your upcoming tests and deadlines.",
            placement: "bottom",
        },
        {
            target: "#recent-tests",
            content:
                "This section shows tests you have recently taken or are in progress.",
            placement: "bottom",
        },
    ];

    const makerExtraSteps: Step[] = [
        {
            target: "#question-banks",
            content: "Create and manage your question banks here.",
            placement: "bottom",
        },
        {
            target: "#top-takers",
            content: "See the top performers on your tests.",
            placement: "bottom",
        },
    ];

    const steps =
        user?.role === ROLES.MAKER
            ? [...baseSteps, ...makerExtraSteps]
            : baseSteps;

    return (
        <Joyride
            steps={steps}
            run={runTour}
            callback={handleJoyrideCallback}
            continuous
            showProgress
            showSkipButton
            styles={joyrideStyles}
        />
    );
};

export default OnboardingTour;
