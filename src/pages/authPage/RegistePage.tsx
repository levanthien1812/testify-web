import { Link, useNavigate } from "react-router-dom";
import { register as registerService } from "../../services/auth";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../../stores/auth";
import { ROLES } from "../../config/constants/tests";
import Button from "../../components/elements/Button";
import AuthInput from "./AuthInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";

type RegisterFields = {
    name: string;
    email: string;
    username: string;
    password: string;
    password_confirm: string;
};

const RegistePage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFields>();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { mutate: registerMutate, isLoading: registerLoading } = useMutation({
        mutationFn: async (data: RegisterFields) => {
            const responseData = await registerService(data!);
            return responseData.data;
        },
        mutationKey: [`register`],
        onSuccess: (data: any) => {
            toast.success("Register successfully");

            const { user, tokens } = data;
            dispatch(authActions.authenticate({ user, tokens }));

            if (user.role === ROLES.MAKER) {
                navigate("/");
            }
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        },
    });

    const handleRegister: SubmitHandler<RegisterFields> = async (data) => {
        registerMutate(data);
    };

    return (
        <div className="h-screen bg-orange-600 flex justify-center items-start">
            <form
                className="bg-white px-4 pt-10 pb-6 mt-10 min-w-80 max-w-80 flex flex-col items-center shadow-xl shrink-0"
                onSubmit={handleSubmit(handleRegister)}
            >
                <h2 className="text-3xl">Register</h2>
                <p className="text-center leading-5 text-gray-500 text-[14px] italic">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Eveniet tenetur error.
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
                        labelText="Username"
                        {...register("username", {
                            required: "Username is required",
                            minLength: {
                                value: 3,
                                message:
                                    "Username must be at least 3 characters",
                            },
                        })}
                        placeholder="Eg. jenedy123"
                        error={errors?.username && errors?.username.message}
                        tabIndex={3}
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
        </div>
    );
};

export default RegistePage;
