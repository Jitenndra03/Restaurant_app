import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createRazorpayOrder, verifyPayment } from "../controllers/paymentController.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/create-order", protect, createRazorpayOrder);
paymentRoutes.post("/verify", protect, verifyPayment);

export default paymentRoutes;
