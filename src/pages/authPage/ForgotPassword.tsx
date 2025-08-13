import { useState } from "react";
import { useForm } from "react-hook-form";
import { ForgotPasswordBodyItf } from "../../types/types";
import { sendResetPasswordEmail } from "../../services/auth";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import AuthInput from "./AuthInput";
import Button from "../../components/elements/Button";
import { useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const location = useLocation();
    const [isEmailSent, setIsEmailSent] = useState(false);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<ForgotPasswordBodyItf>({
        defaultValues: {
            email: location.state?.email || "",
        },
    });

    const { mutate: forgotPasswordMutate, isLoading: forgotPasswordLoading } =
        useMutation({
            mutationFn: async (data: ForgotPasswordBodyItf) => {
                const responseData = await sendResetPasswordEmail(data!);
                return responseData.data;
            },
            mutationKey: [`send-reset-password-email`],
            onSuccess: (data: any) => {
                toast.success("Send reset password email successfully");
                setIsEmailSent(true);
            },
        });

    const handleSendResetPassswordEmail = async (
        data: ForgotPasswordBodyItf
    ) => {
        forgotPasswordMutate(data);
    };

    return (
        <div className="h-screen bg-orange-600 flex justify-center items-center md:items-start">
            <form
                className="bg-white px-4 pt-6 md:pt-10 pb-6 mt-0 md:mt-10 min-w-80 max-w-96 flex flex-col items-center shadow-xl shrink-0"
                onSubmit={handleSubmit(handleSendResetPassswordEmail)}
            >
                <div className="w-full">
                    <Link
                        className="text-gray-400 hover:text-gray-500 flex items-center active:text-orange-500 italic"
                        to={"/login"}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                        <span className="ml-2">Back to login</span>
                    </Link>
                </div>
                <h2 className="text-3xl">Forgot password?</h2>
                <p className="text-center leading-5 text-gray-500 text-[14px] italic">
                    Enter your email address and we will send you a link to
                    reset your password.
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
                    />
                </div>
                {isEmailSent && (
                    <div className="text-center leading-5 text-green-600 text-[14px] italic p-2 border border-green-600 mt-4">
                        Check your email to find the reset password link that we
                        have sent to you!
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                    disabled={forgotPasswordLoading}
                >
                    {forgotPasswordLoading ? "Sending..." : "Send"}
                </Button>
            </form>
        </div>
    );
};

export default ForgotPassword;
