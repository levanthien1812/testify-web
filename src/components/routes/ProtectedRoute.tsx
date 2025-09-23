import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/hooks";

const ProtectedRoute: React.FC<{
    allowedRoles: string[] | undefined;
}> = ({ allowedRoles }) => {
    const user = useAppSelector((state) => state.auth.user);
    const location = useLocation();

    if (!user) {
        return <Navigate to={`/login?redirect_url=${location.pathname}`} />;
    }

    if (allowedRoles) {
        if (!allowedRoles.includes(user?.role)) {
            toast.error("You are now allowed to access this page!");

            return <Navigate to={"/"} />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
