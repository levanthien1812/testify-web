import { FormEvent, useState } from "react";
import Input from "./components/Input";
import { Link, useNavigate } from "react-router-dom";
import { LoginBodyItf, LoginErrorItf } from "../../types/types";
import { useDispatch } from "react-redux";
import { LoginSchema } from "../../validations/auth";
import { login, loginGoogle } from "../../services/auth";
import { isSuccess } from "../../utils/response";
import { authActions } from "../../stores/auth";
import { toast } from "react-toastify";
import { roles } from "../../config/config";
import { AxiosError } from "axios";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<LoginErrorItf | null>({});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        const loginBody: LoginBodyItf = {
            email,
            password,
        };

        const validateResult = LoginSchema.validate(loginBody);

        if (validateResult.error) {
            const errors = validateResult.error.details.reduce((prev, curr) => {
                return { ...prev, [curr.path[0]]: curr.message };
            }, {});

            setError(errors);
        }

        if (error) return;

        try {
            const response = await login(loginBody);

            if (isSuccess(response)) {
                const { user, tokens } = response.data;

                dispatch(authActions.authenticate({ user, tokens }));

                toast.success("Login successfuly. Welcome back to our app!");

                if (user.role === roles.MAKER) {
                    navigate("/home");
                }
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error);
                toast.error(error.response?.data.message);
            }
        }
    };

    const handleLoginGoogle = async (
        credentialResponse: CredentialResponse
    ) => {
        try {
            const response = await loginGoogle(credentialResponse.credential!);

            if (isSuccess(response)) {
                const { user, tokens } = response.data;

                dispatch(authActions.authenticate({ user, tokens }));

                toast.success("Login successfuly. Welcome back to our app!");

                navigate("/home");
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
    };

    return (
        <div className="h-screen bg-orange-600 flex justify-center items-start">
            <div className="bg-white px-4 pt-10 pb-6 mt-10 min-w-80 max-w-80 flex flex-col items-center shadow-xl">
                <h2 className="text-3xl">Login</h2>

                <div className="px-8 text-center leading-5">
                    If you are a test taker, please{" "}
                    {/* <button
                        type="button"
                        className="text-orange-600 hover:underline"
                        onClick={() => loginGoogle()}
                    >
                        login by google account
                    </button> */}
                    <GoogleLogin
                        onSuccess={handleLoginGoogle}
                        onError={() => {
                            console.log("Login Failed");
                        }}
                    />
                </div>

                <div className="w-full mt-2 space-y-3">
                    <Input
                        labelText="Email"
                        name="email"
                        type="email"
                        value={email}
                        setValue={setEmail}
                        required={true}
                        error={error?.email}
                        tabIndex={1}
                    />
                    <Input
                        labelText="Password"
                        name="password"
                        type="password"
                        value={password}
                        setValue={setPassword}
                        required={true}
                        error={error?.password}
                        tabIndex={2}
                    />
                </div>

                <button
                    onClick={handleLogin}
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
            </div>
        </div>
    );
};

export default LoginPage;
