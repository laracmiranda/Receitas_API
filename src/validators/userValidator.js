import Joi from "joi";

export const createUserSchema = Joi.object({
    name: Joi.string().max(100).required(),
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(8).required(),
});

export const updateUserSchema = Joi.object({
    name: Joi.string().max(100),
    email: Joi.string().email().max(100),
});

export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
});