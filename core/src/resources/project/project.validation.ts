import Joi, { string } from "joi";

export const createProjectManually = Joi.object({
    project: Joi.object({
        name: Joi.string().required()
    }).required(),
    database: Joi.object({
        name: Joi.string().required(),
        collections: Joi.array().required(),
    }).required()
})

export const validateProject = Joi.object({
    projectId: Joi.string().required(),
})