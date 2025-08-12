import RecentTests from "./components/RecentTests";
import TopTakers from "./components/TopTakers";
import { ROLES } from "../../config/constants/tests";
import { useAppSelector } from "../../hooks/hooks";
import QuestionBanks from "./components/QuestionBanks";
import TestCalendar from "./components/TestCalendar";

const HomePage = () => {
    const user = useAppSelector((state) => state.auth.user);

    return (
        <div className="xl:w-2/3 md:w-5/6 px-2 mx-auto py-4 sm:py-8 md:py-10 space-y-10">
            <TestCalendar />
            <RecentTests />
            {user?.role === ROLES.MAKER && <QuestionBanks />}
            {user?.role === ROLES.MAKER && <TopTakers />}
        </div>
    );
};

export default HomePage;
