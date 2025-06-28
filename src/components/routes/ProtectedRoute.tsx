import React from "react";
import { Navigate, Outlet } from "react-router";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/hooks";

const ProtectedRoute: React.FC<{
    allowedRoles: string[] | undefined;
}> = ({ allowedRoles }) => {
    const user = useAppSelector((state) => state.auth.user);
    if (!user) {
        return <Navigate to={"/login"} />;
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
