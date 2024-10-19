const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Correctly use Schema from mongoose

// Define the review schema using the correct capitalization
const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now // Use Date.now as a function reference
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

// Export the Review model
module.exports = mongoose.model("Review", reviewSchema);
