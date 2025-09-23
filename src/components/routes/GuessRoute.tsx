import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../../hooks/hooks";
import { useSearchParams } from "react-router-dom";

const GuessRoute: React.FC = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [searchParams] = useSearchParams();

    if (user) {
        const redirectUrl = searchParams.get("redirect_url");
        if (redirectUrl) {
            return <Navigate to={decodeURIComponent(redirectUrl)} />;
        } else {
            return <Navigate to={"/"} />;
        }
    }

    return <Outlet />;
};

export default GuessRoute;
