import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    SendVerificationCodeBodyItf,
    VerifyEmailBodyItf,
} from "../../types/types";
import { sendVerificationCode, verifyEmail } from "../../services/auth";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import AuthInput from "./AuthInput";
import Button from "../../components/elements/Button";
import { useLocation, useNavigate } from "react-router";

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [remainingTime, setRemainingTime] = useState(60);

    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm<VerifyEmailBodyItf>({
        defaultValues: {
            email: location.state?.email || "",
            code: "",
        },
    });

    const allValues = watch();

    const { mutate: verifyEmailMutate, isLoading: verifyEmailLoading } =
        useMutation({
            mutationFn: async (data: VerifyEmailBodyItf) => {
                const responseData = await verifyEmail(data!);
                return responseData.data;
            },
            mutationKey: [`verify-email`],
            onSuccess: (data: any) => {
                toast.success("Email verified successfully");
                navigate("/login");
            },
        });

    const { mutate: sendCodeMutate, isLoading: sendCodeLoading } = useMutation({
        mutationFn: async (data: SendVerificationCodeBodyItf) => {
            const responseData = await sendVerificationCode(data!);
            return responseData.data;
        },
        mutationKey: [`send-verification-code`],
        onSuccess: (data: any) => {
            toast.success("Send verification code successfully");
            setRemainingTime(60);
        },
    });

    const handleVerifyEmail = async (data: VerifyEmailBodyItf) => {
        verifyEmailMutate(data);
    };

    useEffect(() => {
        if (!location.state || !location.state.email) {
            toast.warning("Email not found! Please register first.");
            navigate("register");
        }
    }, [location.state, navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (remainingTime <= 0) {
                clearInterval(interval);
                return;
            }
            setRemainingTime((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen bg-orange-600 flex justify-center items-center md:items-start">
            <form
                className="bg-white px-4 pt-6 md:pt-10 pb-6 mt-10 min-w-80 max-w-96 flex flex-col items-center shadow-xl shrink-0"
                onSubmit={handleSubmit(handleVerifyEmail)}
            >
                <h2 className="text-3xl">Verify your email</h2>
                <p className="text-center leading-5 text-gray-500 text-[14px] italic">
                    Check your email to find the verification code that we have
                    sent to you!
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
                        labelText="Code"
                        {...register("code", {
                            required: "Code is required",
                        })}
                        error={errors?.code && errors?.code.message}
                        tabIndex={2}
                        required
                        className="text-center tracking-wide font-bold"
                    />
                </div>

                <div className="w-full mt-2 flex gap-1">
                    <p className="text-gray-500 italic">
                        Didn't receive the email?
                    </p>
                    <button
                        className="text-orange-600 hover:underline italic disabled:text-gray-500 disabled:cursor-not-allowed"
                        disabled={
                            sendCodeLoading ||
                            verifyEmailLoading ||
                            remainingTime > 0
                        }
                        onClick={() => {
                            sendCodeMutate({
                                email: allValues.email,
                            });
                        }}
                        type="button"
                    >
                        {sendCodeLoading ? "Resending..." : "Resend code"}
                    </button>
                    {remainingTime > 0 && (
                        <div className="font-bold text-gray-500 italic">
                            {remainingTime}s
                        </div>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                    disabled={verifyEmailLoading}
                >
                    {verifyEmailLoading ? "Verifying..." : "Verify"}
                </Button>
            </form>
        </div>
    );
};

export default VerifyEmail;
