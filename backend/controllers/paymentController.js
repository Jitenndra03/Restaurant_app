import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";

// Initialise Razorpay instance (keys from .env)
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * POST /api/payment/create-order  (protected)
 * Creates a Razorpay order for a given app order.
 * Body: { orderId }   (the MongoDB order _id)
 */
export const createRazorpayOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({ message: "orderId is required", success: false });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found", success: false });
        }

        // Create Razorpay order (amount in paise)
        const options = {
            amount: Math.round(order.totalAmount * 100),
            currency: "INR",
            receipt: orderId.toString(),
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        res.status(200).json({
            success: true,
            razorpayOrder,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.log("Razorpay create-order error:", error.message);
        res.status(500).json({ message: "Payment initiation failed", success: false });
    }
};

/**
 * POST /api/payment/verify  (protected)
 * Verifies the Razorpay payment signature and marks order as paid.
 * Body: { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const verifyPayment = async (req, res) => {
    try {
        const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Create expected signature
        const expectedSig = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSig !== razorpay_signature) {
            // Signature mismatch → payment may be tampered
            await Order.findByIdAndUpdate(orderId, { paymentStatus: "failed" });
            return res.status(400).json({ message: "Payment verification failed", success: false });
        }

        // Signature valid → mark as paid
        await Order.findByIdAndUpdate(orderId, { paymentStatus: "paid" });

        // Clear the user's cart after successful payment
        const userId = req.user.userId;
        await Cart.findOneAndDelete({ user: userId });

        res.status(200).json({ message: "Payment verified successfully", success: true });
    } catch (error) {
        console.log("Razorpay verify error:", error.message);
        res.status(500).json({ message: "Payment verification error", success: false });
    }
};
