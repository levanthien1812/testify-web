import React from "react";
import { useNavigate } from "react-router";

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center py-8 px-8">
            <p className="text-center text-xl">
                You are not allowed to take this test
            </p>
            <div className="flex gap-2">
                <button
                    className="bg-orange-600 text-white mt-4 px-8 py-1"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
                <button
                    className="bg-orange-600 text-white mt-4 px-8 py-1"
                    onClick={() => navigate("/home")}
                >
                    Home
                </button>
            </div>
        </div>
    );
};

export default Forbidden;
