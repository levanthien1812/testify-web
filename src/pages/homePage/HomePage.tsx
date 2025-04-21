import RecentTests from "./components/RecentTests";
import TopTakers from "./components/TopTakers";
import { ROLES } from "../../config/constants/tests";
import { useAppSelector } from "../../hooks/hooks";

const HomePage = () => {
    const user = useAppSelector((state) => state.auth.user);

    return (
        <div className="xl:w-2/3 md:w-5/6 mx-auto py-10">
            <RecentTests />
            {user?.role === ROLES.MAKER && <TopTakers />}
        </div>
    );
};

export default HomePage;
