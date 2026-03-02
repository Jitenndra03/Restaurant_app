import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { addReview, getReviews } from "../controllers/reviewController.js";

const reviewRoutes = express.Router();

reviewRoutes.post("/add", protect, addReview);        // Add / update review (auth)
reviewRoutes.get("/:menuItemId", getReviews);          // Get reviews for item (public)

export default reviewRoutes;
