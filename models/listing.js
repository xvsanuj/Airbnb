const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: { type: String, default: "default-filename" },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1548270515-3b0379ebe70d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v) => v === "" || v === undefined
                ? "https://unsplash.com/photos/silhouette-of-metal-frames-during-golden-hour-DW5nDo8AN7M"
                : v,
        },
    },
    price: {
        type: Number,
        required: true,
    },
    location: String,
    country: String,
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete",async(listing) => {
    if(listing){
        await Review.deleteMany({ _id: {$in: listing.review}});
    }
   
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
