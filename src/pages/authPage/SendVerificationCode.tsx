import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SendVerificationCodeBodyItf } from "../../types/types";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import AuthInput from "./AuthInput";
import Button from "../../components/elements/Button";
import { useLocation, useNavigate } from "react-router";
import { sendVerificationCode } from "../../services/auth";

const SendVerificationCode = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm<SendVerificationCodeBodyItf>({
        defaultValues: {
            email: location.state?.email || "",
        },
    });

    const allValues = watch();

    const { mutate: sendCodeMutate, isLoading: sendCodeLoading } = useMutation({
        mutationFn: async (data: SendVerificationCodeBodyItf) => {
            const responseData = await sendVerificationCode(data!);
            return responseData.data;
        },
        mutationKey: [`send-verification-code`],
        onSuccess: (data: any) => {
            toast.success("Send verification code successfully");
            navigate("/verify-email", {
                state: {
                    email: allValues.email,
                },
            });
        },
    });

    const handleSendCode = async (data: SendVerificationCodeBodyItf) => {
        sendCodeMutate(data);
    };

    return (
        <div className="h-screen bg-orange-600 flex justify-center items-center md:items-start">
            <form
                className="bg-white px-4 pt-6 md:pt-10 pb-6 mt-10 min-w-80 max-w-96 flex flex-col items-center shadow-xl shrink-0"
                onSubmit={handleSubmit(handleSendCode)}
            >
                <h2 className="text-3xl">Verify your email</h2>
                <p className="text-center leading-5 text-gray-500 text-[14px] italic">
                    Provide your email to receive a verification code.
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
                        error={errors?.email && errors?.email.message}
                        tabIndex={1}
                        required
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                    disabled={sendCodeLoading}
                >
                    {sendCodeLoading
                        ? "Sending email..."
                        : "Get verification code"}
                </Button>
            </form>
        </div>
    );
};

export default SendVerificationCode;
