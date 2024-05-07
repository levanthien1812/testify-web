import React, { useState } from "react";
import Input from "./components/Input";
import { Link } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <div className="h-screen bg-orange-600 flex justify-center items-start">
            <form
                action=""
                method="post"
                className="bg-white px-4 pt-10 pb-6 mt-10 min-w-80 max-w-80 flex flex-col items-center shadow-xl"
            >
                <h2 className="text-3xl">Login</h2>

                <div className="w-full mt-2 space-y-3">
                    <Input
                        labelText="Email"
                        name="email"
                        type="email"
                        value={email}
                        setValue={setEmail}
                    />
                    <Input
                        labelText="Password"
                        name="password"
                        type="password"
                        value={password}
                        setValue={setPassword}
                    />
                </div>

                <button
                    type="submit"
                    className="text-white bg-orange-600 w-full py-1 mt-6 hover:bg-orange-700"
                >
                    Login
                </button>
                <p className="text-sm mt-1">
                    Don't have account? Please{" "}
                    <Link
                        to={"/register"}
                        className="text-orange-600 hover:underline"
                    >
                        register
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
