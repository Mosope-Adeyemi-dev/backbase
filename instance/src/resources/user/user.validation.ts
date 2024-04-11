import Joi from "joi";

export const onboard = Joi.object({
    bio: Joi.string().required(),
    stateOrProvince: Joi.string().required(),
    yearsOfExperience: Joi.number().required(),
    countryCode: Joi.string().required(),
    photo: Joi.string(),
    resume: Joi.string()
})

export const updatedProfile = Joi.object({
    firstname: Joi.string(),
    lastname: Joi.string(),
    email: Joi.string(),
    photo: Joi.binary(),
})