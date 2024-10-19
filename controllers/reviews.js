
const Listing = require("../models/listing");
const Review = require("../models/review");
module.exports.createReview = (async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); // Create new review from request body
    newReview.author = req.user._id;

    listing.review.push(newReview); // Add review to listing
    await newReview.save(); // Save the review
    await listing.save(); // Save the updated listing
    req.flash("success","New Review created!");
    res.redirect(`/listings/${listing._id}`); // Redirect to the specific listing's page
});

module.exports.destroyReview = async (req,res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove review reference from listing
    await Review.findByIdAndDelete(reviewId); // Delete the review from database
    req.flash("success","review successfull deleted!");
    res.redirect(`/listings/${id}`); // Redirect to the listing's page
};