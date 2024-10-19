const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapsAsync");
const ExpressError = require("../utils/ExpressError");
const {listingSchema,reviewSchema} = require('../schema.js');
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")

const validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg); // Throw error if validation fails
    } else {
        next();
    }
};

// Add a new review to a listing
router.post("/", validatereview,
    isLoggedIn,
     wrapAsync(reviewController.createReview));

// Delete a review from a listing
router.delete("/:reviewId",
    isReviewAuthor, 
    isLoggedIn,
    wrapAsync(reviewController.destroyReview ));

module.exports =router;