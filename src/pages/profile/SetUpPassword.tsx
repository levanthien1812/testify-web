import React, { useEffect } from "react";
import {
    FieldErrors,
    UseFormRegister,
    UseFormUnregister,
    UseFormWatch,
} from "react-hook-form";
import { UserBodyItf } from "../../types/types";
import Input from "../../components/elements/Input";

type Props = {
    register: UseFormRegister<UserBodyItf>;
    errors: FieldErrors<UserBodyItf>;
    watch: UseFormWatch<UserBodyItf>;
    unregister: UseFormUnregister<UserBodyItf>;
};

const SetUpPassword = ({ register, errors, watch, unregister }: Props) => {
    useEffect(() => {
        return () => {
            unregister("password");
            unregister("password_confirm");
        };
    }, [unregister]);

    return (
        <>
            <Input
                {...register("password", {
                    required: "Password is required",
                    minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                    },
                })}
                type="password"
                defaultValue={""}
                error={errors?.password && errors?.password.message}
                label={{ text: "Password" }}
                required
            />
            <Input
                type="password"
                {...register("password_confirm", {
                    required: "Password confirmation is required",
                    validate: (value) => {
                        if (watch("password") !== value) {
                            return "Passwords do not match";
                        }
                        return true;
                    },
                })}
                defaultValue={""}
                error={
                    errors?.password_confirm && errors?.password_confirm.message
                }
                label={{
                    text: "Password confirmation",
                }}
                required
            />
        </>
    );
};

export default SetUpPassword;
