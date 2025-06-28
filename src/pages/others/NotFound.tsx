import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="text-center bg-orange-600 text-white h-screen flex flex-col justify-center items-center">
            <p className="text-3xl font-bold">Not Found 404</p>
            <Link
                to={"/"}
                className="bg-white px-4 py-1 text-orange-600 mt-2 hover:bg-orange-600 hover:text-white hover:outline hover:outline-white"
            >
                Go to home
            </Link>
        </div>
    );
};

export default NotFound;
