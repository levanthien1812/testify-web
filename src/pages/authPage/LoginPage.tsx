import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginService, loginGoogle } from "../../services/auth";
import { isSuccess } from "../../utils/response";
import { authActions } from "../../stores/auth";
import { toast } from "react-toastify";
import { ROLES } from "../../config/config";
import { AxiosError } from "axios";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import Button from "../../components/elements/Button";
import AuthInput from "./AuthInput";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";

type LoginFields = {
    email: string;
    password: string;
};

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<LoginFields>();

    const { mutate: loginMutate, isLoading: loginLoading } = useMutation({
        mutationFn: async (data: LoginFields) => {
            const responseData = await loginService(data!);
            return responseData.data;
        },
        mutationKey: [`login`],
        onSuccess: (data: any) => {
            toast.success("Login successfully");

            const { user, tokens } = data;
            dispatch(authActions.authenticate({ user, tokens }));

            if (user.role === ROLES.MAKER) {
                navigate("/home");
            }
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        },
    });

    const handleLogin = async (data: LoginFields) => {
        loginMutate(data);
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
            <form
                onSubmit={handleSubmit(handleLogin)}
                className="bg-white px-4 pt-10 pb-6 mt-10 min-w-80 max-w-80 flex flex-col items-center shadow-xl"
            >
                <h2 className="text-3xl">Login</h2>

                <div className="px-8 text-center leading-5">
                    If you are a test taker, please{" "}
                    <GoogleLogin
                        onSuccess={handleLoginGoogle}
                        onError={() => {
                            console.log("Login Failed");
                        }}
                    />
                </div>

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
                    />
                    <AuthInput
                        labelText="Password"
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                        })}
                        error={errors?.password && errors?.password.message}
                        tabIndex={2}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                    disabled={loginLoading}
                >
                    {loginLoading ? "Logging in..." : "Login"}
                </Button>
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
