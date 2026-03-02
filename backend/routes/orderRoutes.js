// Import express to create router
import express from "express";
// Import authentication middlewares
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
// Import order controller functions
import {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    deleteOrder
} from "../controllers/orderController.js";

// Create express router instance
const orderRoutes = express.Router();

// Protected routes - require user authentication
orderRoutes.post("/create", protect, createOrder); // Create new order
orderRoutes.get("/my-orders", protect, getUserOrders); // Get logged-in user's orders
orderRoutes.get("/:id", protect, getOrderById); // Get single order by ID
orderRoutes.patch("/cancel/:id", protect, cancelOrder); // Cancel an order

// Admin-only routes - require admin authentication
orderRoutes.get("/", adminOnly, getAllOrders); // Get all orders (admin view)
orderRoutes.patch("/status/:id", adminOnly, updateOrderStatus); // Update order status
orderRoutes.patch("/payment/:id", adminOnly, updatePaymentStatus); // Update payment status
orderRoutes.delete("/delete/:id", adminOnly, deleteOrder); // Delete an order

// Export the router
export default orderRoutes;
