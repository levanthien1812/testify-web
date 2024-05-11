import Joi from "joi";

export const partSchema = Joi.array()
    .items(
        Joi.object().keys({
            _id: Joi.string(),
            name: Joi.string().required(),
            score: Joi.number().required(),
            num_questions: Joi.number().required(),
            description: Joi.string(),
            order: Joi.number().required(),
        })
    )
    .options({
        abortEarly: false,
    });
