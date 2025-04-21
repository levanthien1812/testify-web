import React from "react";
import { Navigate, Outlet } from "react-router";
import { ROLES } from "../../config/constants/tests";
import { useAppSelector } from "../../hooks/hooks";

const GuessRoute: React.FC = () => {
    const user = useAppSelector((state) => state.auth.user);

    if (user && user.role === ROLES.MAKER) {
        return <Navigate to={"/home"} />;
    }

    return <Outlet />;
};

export default GuessRoute;
