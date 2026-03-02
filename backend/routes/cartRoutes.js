// Import express to create router
import express from "express";
// Import authentication middleware to protect cart routes
import { protect } from "../middlewares/authMiddleware.js";
// Import cart controller functions
import {
    addToCart,
    getCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart
} from "../controllers/cartController.js";

/**
 * Cart Routes
 * All cart routes require user authentication via the protect middleware.
 * The cart is tied to the authenticated user, so no user ID is needed in the URL.
 *
 * Endpoints:
 *   POST   /api/cart/add               - Add an item to the cart
 *   GET    /api/cart/                   - Get the current user's cart
 *   DELETE /api/cart/remove/:menuItemId - Remove a specific item from the cart
 *   PATCH  /api/cart/update/:menuItemId - Update quantity of a cart item
 *   DELETE /api/cart/clear              - Remove all items from the cart
 */
const cartRoutes = express.Router();

// Protected routes - all require user authentication
cartRoutes.post("/add", protect, addToCart);                       // Add item to cart
cartRoutes.get("/", protect, getCart);                             // Get user's cart
cartRoutes.delete("/remove/:menuItemId", protect, removeFromCart); // Remove item from cart
cartRoutes.patch("/update/:menuItemId", protect, updateCartItemQuantity); // Update item quantity
cartRoutes.delete("/clear", protect, clearCart);                   // Clear entire cart

// Export the router
export default cartRoutes;
