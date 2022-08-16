const joi = require('joi');

module.exports = {
    OauthUserValidation: async (data) => {
        const schema = joi.object({
            name: joi.string()
                .required()
                .min(2)
                .max(50),
            email: joi.string()
                .required()
                .min(6)
                .max(255),
            thumbnail: joi.string()
                .required(),
            id: joi.string()
                .required()
        })

        return schema.validate(data);
     },
    localUserValidation: (data) => {
        const schema = joi.object({
            name: joi.string()
                .required()
                .min(2)
                .max(50),
            email: joi.string()
                .required()
                .min(6)
                .max(255),
            password: joi.string()
                .min(8)
                .max(1024)
                .required(),
            thumbnail: joi.string(),
            id: joi.string()
                .required(),
            address: joi.object({
                country: joi.string(),
                district: joi.string(),
                location: joi.string()
            })
        })

        return schema.validate(data)
     },

}