import Joi from "joi";
import { publicAnswersOptions, testLevels } from "../config/config";

export const partSchema = Joi.object().keys({
    _id: Joi.string(),
    name: Joi.string().required(),
    score: Joi.number().required().min(0.0001),
    num_questions: Joi.number().required().min(1),
    description: Joi.string(),
    order: Joi.number().required(),
});

export const testFormDataSchema = Joi.object().keys({
    title: Joi.string().required().trim(),
    datetime: Joi.date(),
    description: Joi.string().allow(""),
    duration: Joi.number().required().min(1),
    max_score: Joi.number().required().min(1),
    num_questions: Joi.number().required().min(1),
    level: Joi.string().valid(...Object.values(testLevels)),
    code: Joi.string().allow(""),
    num_parts: Joi.number().min(1),
    close_time: Joi.date().optional(),
    public_answers_option: Joi.string().valid(
        ...Object.values(publicAnswersOptions)
    ),
    public_answers_date: Joi.date().optional(),
});

export const testSchema = Joi.object().keys({});
