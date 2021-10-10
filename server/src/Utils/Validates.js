const Joi = require('joi')

const validateNewUser = req => {
    const schema = Joi.object({
        username: Joi.string().min(2).max(24).required(),
        email: Joi.string().min(5).max(225).required().email(),
        password: Joi.string().min(8).max(50).required()
    })

    return schema.validate(req)
}

const validateLoginForm = req => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(225).required().email(),
        password: Joi.string().min(8).max(50).required()
    })

    return schema.validate(req)
}

module.exports = { validateNewUser, validateLoginForm }
