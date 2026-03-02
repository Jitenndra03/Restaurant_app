import mongoose from "mongoose";

/**
 * Review Schema - Stores user ratings / reviews for menu items.
 * One review per user per menu item (enforced by unique compound index).
 */
const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
        required: true,
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 300,
    },
}, { timestamps: true });

// One review per user per item
reviewSchema.index({ user: 1, menuItem: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
