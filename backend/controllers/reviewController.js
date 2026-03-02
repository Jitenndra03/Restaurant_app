import Review from "../models/reviewModel.js";
import Menu from "../models/menuModel.js";

/**
 * Helper - Recalculate average rating for a menu item from all its reviews.
 */
async function recalcRating(menuItemId) {
    const agg = await Review.aggregate([
        { $match: { menuItem: menuItemId } },
        { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    const avg = agg.length ? Math.round(agg[0].avg * 10) / 10 : 0;
    const count = agg.length ? agg[0].count : 0;
    await Menu.findByIdAndUpdate(menuItemId, { rating: avg, ratingCount: count });
}

/**
 * POST /api/review/add  (protected)
 * Body: { menuItem, rating, comment? }
 */
export const addReview = async (req, res) => {
    try {
        const { menuItem, rating, comment } = req.body;
        const userId = req.user.userId;

        if (!menuItem || !rating) {
            return res.status(400).json({ message: "menuItem and rating are required", success: false });
        }

        // Upsert: create or update the user's review for this item
        const review = await Review.findOneAndUpdate(
            { user: userId, menuItem },
            { rating, comment },
            { new: true, upsert: true, runValidators: true }
        );

        // Recalculate aggregated rating on the Menu document
        await recalcRating(review.menuItem);

        res.status(200).json({ message: "Review saved", success: true, review });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "You already reviewed this item", success: false });
        }
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

/**
 * GET /api/review/:menuItemId  (public)
 * Returns all reviews for a menu item.
 */
export const getReviews = async (req, res) => {
    try {
        const { menuItemId } = req.params;
        const reviews = await Review.find({ menuItem: menuItemId })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
