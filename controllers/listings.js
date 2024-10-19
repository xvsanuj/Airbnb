
const Listing = require("../models/listing");
module.exports.index = (async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
});
module.exports.renderNewForm= (req, res) => {
    res.render("listings/new.ejs"); // Render the new listing form
};

module.exports.showListing = (async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path:"review",
        populate:{
            path:"author",
        }
    },
    ).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found"); // Handle case where listing is not found
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
});

module.exports.createListing = (async (req, res, next) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing"); // Handle missing listing data
    }
    const newListing = new Listing(req.body.listing); // Create new listing from request body
    newListing.owner = req.user._id;
    await newListing.save(); // Save the new listing to database
    req.flash("success", "New Listing created!");
    res.redirect("/listings"); // Redirect to all listings after creation
});
module.exports.renderEditForm = (async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found"); // Handle case where listing is not found
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
});

module.exports.updateListing = (async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing); // Update listing with new data
    req.flash("success", "Listing updated!");
    res.redirect("/listings"); // Redirect to listings page after update
});
module.exports.destroyListing = (async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id); // Delete listing from database
    if (!deletedListing) {
        throw new ExpressError(404, "Listing not found"); // Handle case where listing is not found
    }
    req.flash("success", "Listing deleted!");
    res.redirect("/listings"); // Redirect to listings after deletion
});
