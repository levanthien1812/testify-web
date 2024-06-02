import React from "react";
import logoTestify from "./../../assets/images/logo-testify.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/rootState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

const Header = () => {
    const { user, isAuthened } = useSelector((state: RootState) => state.auth);

    return (
        <div className="bg-white px-12 py-3 flex justify-between items-center shadow-md">
            <Link to={"/home"}>
                <img src={logoTestify} alt="testify-logo" className="w-44" />
            </Link>
            {!isAuthened && (
                <div className="flex gap-6">
                    <button className="text-lg hover:font-bold hover:text-orange-600 active:text-xl">
                        <Link to={"/register"}>Register</Link>
                    </button>
                    <button className="text-lg hover:font-bold hover:text-orange-600 active:text-xl">
                        <Link to={"/login"}>Login</Link>
                    </button>
                </div>
            )}
            {isAuthened && user && (
                <Link
                    to={"/account"}
                    className="flex gap-2 items-center hover:bg-gray-100 rounded-full p-1"
                >
                    <div className="p-2 rounded-full bg-gray-200 w-[40px] h-[40px] flex justify-center items-center">
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    <p className="me-2">{user.name}</p>
                </Link>
            )}
        </div>
    );
};

export default Header;
