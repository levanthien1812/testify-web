import React from "react";
import RecentTests from "./components/RecentTests";
import TopTakers from "./components/TopTakers";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/rootState";

const HomePage = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <div className="xl:w-2/3 md:w-5/6 mx-auto py-10">
            <RecentTests />
            {user?.role === "maker" && <TopTakers />}
        </div>
    );
};

export default HomePage;
