import Joi from "joi";
import { password } from "./custom";

export const registerSchema = Joi.object()
    .keys({
        email: Joi.string()
            .required()
            .email({ tlds: { allow: false } }),
        username: Joi.string().required().min(10),
        name: Joi.string().required(),
        password: Joi.string().required().custom(password),
    })
    .options({ abortEarly: false });
