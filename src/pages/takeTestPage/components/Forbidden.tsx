import React from "react";
import { useNavigate } from "react-router";
import Button from "../../../components/elements/Button";

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center py-8 px-8">
            <p className="text-center text-xl">
                You are not allowed to take this test
            </p>
            <div className="flex gap-2 mt-4">
                <Button onClick={() => navigate(-1)}>Back</Button>
                <Button onClick={() => navigate("/home")}>Home</Button>
            </div>
        </div>
    );
};

export default Forbidden;
