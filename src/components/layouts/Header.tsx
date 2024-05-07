import React from "react";
import logoTestify from "./../../assets/images/logo-testify.png";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="bg-white px-12 py-3 flex justify-between items-center shadow-md">
            <div>
                <img src={logoTestify} alt="testify-logo" className="w-44" />
            </div>
            <div className="flex gap-6">
                <button className="text-lg hover:font-bold hover:text-orange-600 active:text-xl">
                    <Link to={"/register"}>Register</Link>
                </button>
                <button className="text-lg hover:font-bold hover:text-orange-600 active:text-xl">
                    <Link to={"/login"}>Login</Link>
                </button>
            </div>
        </div>
    );
};

export default Header;
