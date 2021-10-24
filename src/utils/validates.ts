import Joi from 'joi';

export function validateRegister(req) {
    const schema = Joi.object({
        username: Joi.string().min(2).max(24).required(),
        email: Joi.string().min(5).max(225).required().email(),
        password: Joi.string().min(8).max(50).required()
    });

    return schema.validate(req);
}

export function validateLogin(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(225).required().email(),
        password: Joi.string().min(8).max(50).required()
    });

    return schema.validate(req);
}
