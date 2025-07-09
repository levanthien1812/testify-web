import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ResetPasswordBodyItf } from "../../types/types";
import { resetPassword } from "../../services/auth";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import AuthInput from "./AuthInput";
import Button from "../../components/elements/Button";
import { useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<ResetPasswordBodyItf>({
        defaultValues: {
            email: params.get("email") || "",
            token: params.get("token") || "",
            password: "",
            password_confirm: "",
        },
    });

    const { mutate: resetPasswordMutate, isLoading: resetPasswordLoading } =
        useMutation({
            mutationFn: async (data: ResetPasswordBodyItf) => {
                const responseData = await resetPassword(data!);
                return responseData.data;
            },
            mutationKey: [`reset-password`],
            onSuccess: (data: any) => {
                toast.success("Password reset successfully");
                navigate("/login");
            },
        });

    const handleResetPassword = async (data: ResetPasswordBodyItf) => {
        resetPasswordMutate(data);
    };

    useEffect(() => {
        if (!params.has("email") || !params.has("token")) {
            toast.warning("Email or token not found! Please try again.");
            navigate("/login");
        }
    }, [params, navigate]);
    return (
        <div className="h-screen bg-orange-600 flex justify-center items-start">
            <form
                className="bg-white px-4 pt-10 pb-6 mt-10 min-w-80 max-w-80 flex flex-col items-center shadow-xl shrink-0"
                onSubmit={handleSubmit(handleResetPassword)}
            >
                <h2 className="text-3xl">Reset your password</h2>
                <p className="text-center leading-5 text-gray-500 text-[14px] italic">
                    Provide your new password and confirm it.
                </p>

                <div className="w-full mt-2 space-y-3">
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
                        tabIndex={1}
                        required
                        disabled
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
                    disabled={resetPasswordLoading}
                >
                    {resetPasswordLoading
                        ? "Resetting password..."
                        : "Reset password"}
                </Button>
            </form>
        </div>
    );
};

export default ResetPassword;
