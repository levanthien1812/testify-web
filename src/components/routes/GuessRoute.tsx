import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/rootState";
import HomePage from "../../pages/homePage/HomePage";
import { Navigate, Outlet } from "react-router";

const GuessRoute: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    if (user && user.role === "maker") {
        return <Navigate to={"/home"} />;
    }

    return <Outlet />;
};

export default GuessRoute;
