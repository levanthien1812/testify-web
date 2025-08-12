import { useEffect, useState } from "react";
import logoTestify from "./../../assets/images/logo-testify.png";
import { Link, useNavigate } from "react-router-dom";
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
import { ROLES } from "../../config/constants/tests";
import { useAppSelector } from "../../hooks/hooks";
import PasscodeLink from "../../pages/createTestPage/components/testTakers/PasscodeLink";
import { takeTestActions } from "../../stores/takeTest";
import { PasscodeItf } from "../../types/types";
import Profile from "../../pages/profile/Profile";
import Popover from "../modals/Popover";
import { formatImageUrl } from "../../utils/formatImageUrl";

const Header = () => {
    const { user, isAuthened } = useAppSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [isEnteringPasscodeLink, setIsEnteringPasscodeLink] = useState(false);
    const { isPasscodeValidated } = useAppSelector((state) => state.takeTest);
    const [isViewingProfile, setIsViewingProfile] = useState(false);
    const [hideActions, setHideActions] = useState(false);
    const navigate = useNavigate();

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
            dispatch(authActions.logout());
            window.location.href = "/login";
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
        <div className="bg-white px-2 sm:px-4 md:px-12 py-1 sm:py-2 md:py-3 flex justify-between items-center shadow-md sticky top-0 z-10">
            <Link to={"/"}>
                <img
                    src={logoTestify}
                    alt="testify-logo"
                    className="w-28 sm:w-36 md:w-44"
                />
            </Link>
            {!isAuthened && (
                <div className="md:flex gap-6 hidden">
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
                    {user.role === ROLES.TAKER && !isPasscodeValidated && (
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
                    <Popover
                        content={
                            <div className="bg-white shadow-md px-2 py-2 w-full space-y-1">
                                <Button
                                    outlined
                                    className="w-full"
                                    onClick={() => {
                                        setIsViewingProfile(true);
                                        setHideActions(true);
                                    }}
                                >
                                    Profile
                                </Button>
                                <Button
                                    secondary
                                    className="w-full"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </div>
                        }
                        hideContent={hideActions}
                    >
                        <div className="flex gap-2 items-center hover:bg-gray-100 p-1 cursor-pointer">
                            <img
                                src={
                                    user.photo && user.photo.length > 0
                                        ? formatImageUrl(user.photo)
                                        : defaultUserPhoto
                                }
                                alt="user"
                                className="w-[32px] h-[32px] sm:w-[38px] sm:h-[38px] md:w-[44px] md:h-[44px] object-cover rounded-full shadow-md"
                            />

                            <span className="me-2 hidden md:block">
                                {user.name}
                            </span>
                        </div>
                    </Popover>
                    <div className="relative">
                        {isEnteringPasscodeLink && (
                            <PasscodeLink
                                onClose={() => setIsEnteringPasscodeLink(false)}
                                onSuccess={(data: PasscodeItf) => {
                                    dispatch(
                                        takeTestActions.setEnteredPasscode(
                                            data.code
                                        )
                                    );
                                    setIsEnteringPasscodeLink(false);
                                    navigate(`/tests/${data.id}`);
                                }}
                            />
                        )}

                        {isViewingProfile && (
                            <Profile
                                onClose={() => {
                                    setIsViewingProfile(false);
                                    setHideActions(false);
                                }}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
