const Joi = require('joi');

module.exports.listingSchema = Joi.object({
        title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.string().allow("",null),
    
});
module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().required(),
    }).required(),
});