import { useEffect, useState } from "react";
import logoTestify from "./../../assets/images/logo-testify.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/rootState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "react-query";
import Cookies from "js-cookie";
import { logout } from "../../services/auth";
import { useDispatch } from "react-redux";
import { authActions } from "../../stores/auth";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Button from "../elements/Button";
import defaultUserPhoto from "./../../assets/images/default-user-photo.png";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/config";
import PasscodeLink from "../modals/PasscodeLink";

const Header = () => {
    const { user, isAuthened } = useSelector((state: RootState) => state.auth);
    const [showActions, setShowActions] = useState(false);
    const dispatch = useDispatch();
    const [isEnteringPasscodeLink, setIsEnteringPasscodeLink] = useState(false);

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
                    <Button>
                        <Link to={"/register"}>Register</Link>
                    </Button>
                    <Button>
                        <Link to={"/login"}>Login</Link>
                    </Button>
                </div>
            )}
            {isAuthened && user && (
                <div className="flex gap-4 items-center">
                    {user.role === ROLES.TAKER && (
                        <div>
                            <Button
                                onClick={() => setIsEnteringPasscodeLink(true)}
                            >
                                Enter passcode or link
                            </Button>
                        </div>
                    )}
                    <div className="relative">
                        <Link to={"/chat"}>
                            <FontAwesomeIcon
                                className="text-2xl text-gray-500 hover:text-orange-600 transition-all duration-150"
                                icon={faComments}
                            />
                        </Link>
                        <div className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full flex items-center justify-center px-1 leading-none">
                            2
                        </div>
                    </div>
                    <div className="relative">
                        <button
                            className="flex gap-2 items-center hover:bg-gray-100 p-1 min-w-40"
                            onClick={() => setShowActions(!showActions)}
                        >
                            <img
                                src={
                                    user.photo && user.photo.length > 0
                                        ? user.photo
                                        : defaultUserPhoto
                                }
                                alt="user"
                                className="w-[40px] h-[40px] object-cover rounded-full shadow-md"
                            />

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

                        {isEnteringPasscodeLink && (
                            <PasscodeLink
                                onClose={() => setIsEnteringPasscodeLink(false)}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
