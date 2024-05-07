import React, { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import Input from "./components/Input";
import { RegisterBodyItf, RegisterErrorItf } from "../../types/types";
import { registerSchema } from "../../validations/register";
import { register } from "../../services/auth";
import { isSuccess } from "../../utils/response";
import { toast } from "react-toastify";

const RegistePage = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [error, setError] = useState<RegisterErrorItf | null>({});

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
                toast.success("Register successfuly. Welcome to our app!");
            }
        } catch (error ) {
            toast.error("error");
        }
    };

    return (
        <div className="h-screen bg-orange-600 flex justify-center items-start">
            <form
                onSubmit={handleRegister}
                method="post"
                className="bg-white px-4 pt-10 pb-6 mt-10 min-w-80 max-w-80 flex flex-col items-center shadow-xl shrink-0"
            >
                <h2 className="text-3xl">Register</h2>
                <p className="text-center leading-5 text-gray-500 text-[14px] italic">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Eveniet tenetur error.
                </p>

                <div className="w-full mt-2 space-y-3">
                    <Input
                        labelText="Name"
                        name="name"
                        value={name}
                        setValue={setName}
                        placeholder="Eg. Christopher Jenedy"
                        error={error?.name}
                        tabIndex={1}
                    />
                    <Input
                        labelText="Email"
                        name="email"
                        type="email"
                        value={email}
                        setValue={setEmail}
                        placeholder="Eg. jenedy123@gmail.com"
                        error={error?.email}
                        tabIndex={2}
                    />
                    <Input
                        labelText="Username"
                        name="username"
                        value={username}
                        setValue={setUsername}
                        placeholder="Eg. jenedy123"
                        error={error?.username}
                        tabIndex={3}
                    />
                    <Input
                        labelText="Password"
                        name="password"
                        type="password"
                        value={password}
                        setValue={setPassword}
                        placeholder="********"
                        error={error?.password}
                        tabIndex={4}
                    />
                    <Input
                        labelText="Password confirmation"
                        type="password"
                        name="passwordConfirm"
                        value={passwordConfirm}
                        setValue={setPasswordConfirm}
                        placeholder="********"
                        error={error?.password_confirm}
                        tabIndex={5}
                    />
                </div>

                <button
                    type="submit"
                    className="text-white bg-orange-600 w-full py-1 mt-6 hover:bg-orange-700"
                >
                    Register
                </button>
                <p className="text-sm mt-1">
                    Already have account? Please{" "}
                    <Link
                        to={"/login"}
                        className="text-orange-600 hover:underline"
                    >
                        login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default RegistePage;
