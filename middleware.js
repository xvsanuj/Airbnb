const Listing = require("./models/listing");
const ExpressError = require("./schema");
const { ListingSchema, reviewSchema } = require("./schema");
const Review = require("./models/review")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to create listings");
        return res.redirect("/login"); // Redirect to login if not authenticated
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params; // Correct destructuring
    const listing = await Listing.findById(id); // Await the result
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const { error } = ListingSchema.validate(req.body); // Use correct schema
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(","); // Correct the join method
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); // Use correct schema for reviews
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(","); // Correct the join method
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id,reviewId } = req.params; // Correct destructuring
    const review = await Review.findById(id); // Await the result
    if (!review.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listing/${id}`);
    }
    next();
};
