import Cookies from "js-cookie";
import React, { Children } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { RootState } from "../../stores/rootState";
import { toast } from "react-toastify";

const ProtectedRoute: React.FC<{
    allowedRoles: [String] | undefined;
}> = ({ allowedRoles }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    if (!user) {
        return <Navigate to={"/login"} />;
    }

    if (allowedRoles) {
        if (!allowedRoles.includes(user?.role)) {
            toast.error("You are now allowed to access this page!");
        }
    }
    return <Outlet />;
};

export default ProtectedRoute;
