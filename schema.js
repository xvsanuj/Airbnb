const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),      // Title must be a string and is required
    description: Joi.string().required(), // Description must be a string and is required
    country: Joi.string().required(),    // Country must be a string and is required
    price: Joi.number().positive().required().min(0), // Price must be a positive number and is required
    image: Joi.string().allow(" ", null), // Image can be an empty string or null
    location: Joi.string().required(), // Location must be a string and is required
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5), // Rating between 1 and 5
    comment: Joi.string().required(),  // Comment is required
  }).required(),
});

module.exports = {
  listingSchema,
  reviewSchema,
};
