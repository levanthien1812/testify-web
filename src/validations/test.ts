import Joi from "joi";

export const partSchema = Joi.array()
    .items(
        Joi.object().keys({
            name: Joi.string().required(),
            score: Joi.number().required(),
            num_questions: Joi.number().required(),
            description: Joi.string(),
        })
    )
    .options({
        abortEarly: false,
    });
