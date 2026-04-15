import RecentTests from "./components/RecentTests";
import TopTakers from "./components/TopTakers";
import { ROLES } from "../../config/constants/tests";
import { useAppSelector } from "../../hooks/hooks";
import QuestionBanks from "./components/QuestionBanks";
import TestCalendar from "./components/TestCalendar";
import OnboardingTour from "./components/OnboardingTour";
import RecentTestTemplates from "./components/RecentTestTemplates";

const HomePage = () => {
    const user = useAppSelector((state) => state.auth.user);

    return (
        <div className="xl:w-2/3 md:w-5/6 px-2 mx-auto py-4 sm:py-8 md:py-10 space-y-10">
            <OnboardingTour />
            <div id="test-calendar">
                <TestCalendar />
            </div>
            <div id="recent-tests">
                <RecentTests />
            </div>
            {user?.role === ROLES.MAKER && (
                <div id="recent-test-templates">
                    <RecentTestTemplates />
                </div>
            )}
            {user?.role === ROLES.MAKER && (
                <div id="question-banks">
                    <QuestionBanks />
                </div>
            )}
            {user?.role === ROLES.MAKER && (
                <div id="top-takers">
                    <TopTakers />
                </div>
            )}
        </div>
    );
};

export default HomePage;
