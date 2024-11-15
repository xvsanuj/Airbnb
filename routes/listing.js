const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapsAsync"); // Ensure this path is correct
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware.js"); // Import isLoggedIn middleware
const listingController = require("../controllers/listings.js");

// Middleware to validate listing data using Joi schema
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        return next(new ExpressError(400, errMsg)); // Pass error to next
    }
    next();
};

// Route to display all listings
router.get("/", wrapAsync(listingController.index));

// Route to render a form to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show specific listing by ID, including reviews
router.get("/:id", wrapAsync(listingController.showListing));

// Create a new listing
router.post("/", validateListing, isLoggedIn, wrapAsync(listingController.createListing));

// Route to edit a listing by ID
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

// Update an existing listing by ID
router.put("/:id", isLoggedIn, validateListing, wrapAsync(listingController.updateListing));

// Delete a listing by ID
router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyListing));

module.exports = router; // Correctly export the router