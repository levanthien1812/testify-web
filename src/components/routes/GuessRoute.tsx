import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/rootState";
import HomePage from "../../pages/homePage/HomePage";
import { Outlet } from "react-router";

const GuessRoute: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    console.log(user)

    if (user) {
        return <HomePage />;
    }

    return <Outlet />;
};

export default GuessRoute;
