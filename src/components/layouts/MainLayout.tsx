import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router";
import UseMatchesBreadcrumbs from "../breadcrumbs/UseMatchesBreadcrumbs";
import { useAppSelector } from "../../hooks/hooks";

const MainLayout: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-1">
                {user && <UseMatchesBreadcrumbs />}
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;
