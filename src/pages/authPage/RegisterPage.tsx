import { Link, useNavigate } from "react-router-dom";
import { register as registerService } from "../../services/auth";
import { toast } from "react-toastify";
import Button from "../../components/elements/Button";
import AuthInput from "./AuthInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useState } from "react";
import ConfirmModal from "../../components/modals/ConfirmModal";

type RegisterFields = {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
};

const RegisterPage = () => {
    const [isNavigatingToEmailVerification, setIsNavigaingToEmailVerification] =
        useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFields>();

    const navigate = useNavigate();
    const { email: enteredEmail } = watch();

    const { mutate: registerMutate, isLoading: registerLoading } = useMutation({
        mutationFn: async (data: RegisterFields) => {
            const responseData = await registerService(data!);
            return responseData.data;
        },
        mutationKey: [`register`],
        onSuccess: (data: any) => {
            toast.success("Register successfully");
            setIsNavigaingToEmailVerification(true);
        },
    });

    const handleRegister: SubmitHandler<RegisterFields> = async (data) => {
        registerMutate(data);
    };

    return (
        <div className="h-screen bg-orange-600 flex justify-center items-center md:items-start">
            <form
                className="bg-white px-4 pt-6 md:pt-10 pb-6 mt-0 md:mt-10 min-w-80 max-w-96 flex flex-col items-center shadow-xl shrink-0"
                onSubmit={handleSubmit(handleRegister)}
            >
                <h2 className="text-3xl">Register</h2>
                <p className="text-center leading-5 text-gray-500 text-[14px] italic">
                    Create your free account. It only takes a minute to get
                    started and unlock all of our features.
                </p>

                <div className="w-full mt-2 space-y-3">
                    <AuthInput
                        labelText="Name"
                        {...register("name", {
                            required: "Name is required",
                        })}
                        placeholder="Eg. Christopher Jenedy"
                        error={errors?.name && errors?.name.message}
                        tabIndex={1}
                        required
                    />
                    <AuthInput
                        labelText="Email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                                message: "Invalid email address",
                            },
                        })}
                        placeholder="Eg. jenedy123@gmail.com"
                        error={errors?.email && errors?.email.message}
                        tabIndex={2}
                        required
                    />
                    <AuthInput
                        labelText="Password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message:
                                    "Password must be at least 8 characters",
                            },
                        })}
                        type="password"
                        placeholder="********"
                        error={errors?.password && errors?.password.message}
                        tabIndex={4}
                        required
                    />
                    <AuthInput
                        labelText="Password confirmation"
                        type="password"
                        {...register("password_confirm", {
                            required: "Password confirmation is required",
                            validate(value) {
                                if (value !== watch("password")) {
                                    return "Passwords do not match";
                                }
                                return true;
                            },
                        })}
                        placeholder="********"
                        error={
                            errors?.password_confirm &&
                            errors?.password_confirm.message
                        }
                        tabIndex={5}
                        required
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                    disabled={registerLoading}
                >
                    {registerLoading ? "Registering..." : "Register"}
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
            </form>
            {isNavigatingToEmailVerification && (
                <ConfirmModal
                    title="Email Verification"
                    message="Your account has been created! Please proceed to confirm your email address to activate your account."
                    onConfirm={() =>
                        navigate("/verify-email", {
                            state: {
                                email: enteredEmail,
                            },
                        })
                    }
                    onClose={() => setIsNavigaingToEmailVerification(false)}
                    actionText="Proceed"
                />
            )}
        </div>
    );
};

export default RegisterPage;
