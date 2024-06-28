import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/elements/Input";
import { RegisterBodyItf, RegisterErrorItf } from "../../types/types";
import { registerSchema } from "../../validations/auth";
import { register } from "../../services/auth";
import { isSuccess } from "../../utils/response";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../../stores/auth";
import Cookies from "js-cookie";
import { roles } from "../../config/config";
import Button from "../../components/elements/Button";
import AuthInput from "./AuthInput";

const RegistePage = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [error, setError] = useState<RegisterErrorItf | null>({});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        const userBody: RegisterBodyItf = {
            name,
            email,
            username,
            password,
        };

        const validateResult = registerSchema.validate(userBody);

        if (validateResult.error) {
            const errors = validateResult.error.details.reduce((prev, curr) => {
                return { ...prev, [curr.path[0]]: curr.message };
            }, {});

            setError(errors);
        }

        if (password !== passwordConfirm) {
            setError((prev) => {
                return {
                    ...prev,
                    password_confirm: "Password confirmation does not match",
                };
            });
        }

        if (error) return;

        try {
            const response = await register(userBody);

            if (isSuccess(response)) {
                const { user, tokens } = response.data;

                Cookies.set("user", JSON.stringify(user), {
                    expires: new Date(tokens.access.expires),
                });
                Cookies.set("access_token", tokens.access.token, {
                    expires: new Date(tokens.access.expires),
                });
                Cookies.set("refresh_token", tokens.refresh.token, {
                    expires: new Date(tokens.refresh.expires),
                });

                dispatch(authActions.authenticate({ user, tokens }));

                toast.success("Register successfuly. Welcome to our app!");

                if (user.role === roles.MAKER) {
                    navigate("/home");
                }
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
    };

    return (
        <div className="h-screen bg-orange-600 flex justify-center items-start">
            <div className="bg-white px-4 pt-10 pb-6 mt-10 min-w-80 max-w-80 flex flex-col items-center shadow-xl shrink-0">
                <h2 className="text-3xl">Register</h2>
                <p className="text-center leading-5 text-gray-500 text-[14px] italic">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Eveniet tenetur error.
                </p>

                <div className="w-full mt-2 space-y-3">
                    <AuthInput
                        labelText="Name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Eg. Christopher Jenedy"
                        error={error?.name}
                        tabIndex={1}
                    />
                    <AuthInput
                        labelText="Email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Eg. jenedy123@gmail.com"
                        error={error?.email}
                        tabIndex={2}
                    />
                    <AuthInput
                        labelText="Username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Eg. jenedy123"
                        error={error?.username}
                        tabIndex={3}
                    />
                    <AuthInput
                        labelText="Password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        error={error?.password}
                        tabIndex={4}
                    />
                    <AuthInput
                        labelText="Password confirmation"
                        type="password"
                        name="passwordConfirm"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="********"
                        error={error?.password_confirm}
                        tabIndex={5}
                    />
                </div>

                <Button
                    onClick={handleRegister}
                    className="w-full mt-6"
                    size="lg"
                >
                    Register
                </Button>
                <p className="text-sm mt-1">
                    Already have account? Please{" "}
                    <Link
                        to={"/login"}
                        className="text-orange-600 hover:underline"
                    >
                        login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegistePage;
