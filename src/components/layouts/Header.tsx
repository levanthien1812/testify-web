import React, { useEffect, useMemo, useState } from "react";
import logoTestify from "./../../assets/images/logo-testify.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/rootState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useMutation } from "react-query";
import Cookies from "js-cookie";
import { logout } from "../../services/auth";
import { useDispatch } from "react-redux";
import { authActions } from "../../stores/auth";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Button from "../../pages/authPage/components/Button";

const Header = () => {
    const { user, isAuthened } = useSelector((state: RootState) => state.auth);
    const [showActions, setShowActions] = useState(false);
    const dispatch = useDispatch();

    const { mutate, isLoading } = useMutation({
        mutationFn: async () => {
            const refreshToken = Cookies.get("refresh_token");
            return await logout(refreshToken!);
        },
        mutationKey: ["logout"],
        onSuccess: (data) => {
            dispatch(authActions.logout());
            window.location.href = "/login";
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message);
            }
        },
    });

    const handleLogout = () => {
        mutate();
    };

    useEffect(() => {
        if (isLoading) {
            toast.loading("Logging out...");
        } else {
            toast.dismiss();
        }
    }, [isLoading]);

    return (
        <div className="bg-white px-12 py-3 flex justify-between items-center shadow-md">
            <Link to={"/home"}>
                <img src={logoTestify} alt="testify-logo" className="w-44" />
            </Link>
            {!isAuthened && (
                <div className="flex gap-6">
                    <Button className="text-lg">
                        <Link to={"/register"}>Register</Link>
                    </Button>
                    <Button className="text-lg">
                        <Link to={"/login"}>Login</Link>
                    </Button>
                </div>
            )}
            {isAuthened && user && (
                <div className="relative">
                    <button
                        className="flex gap-2 items-center hover:bg-gray-100 p-1"
                        onClick={() => setShowActions(!showActions)}
                    >
                        <div className="p-2 bg-gray-200 w-[40px] h-[40px] flex justify-center items-center">
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <span className="me-2">{user.name}</span>
                    </button>

                    {showActions && (
                        <div className="absolute mt-2 bg-white shadow-md px-2 py-2 w-full">
                            <Button
                                primary={false}
                                className="w-full"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Header;
