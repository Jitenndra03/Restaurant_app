// Import express to create router
import express from "express";
// Import authentication middlewares
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
// Import multer middleware for file uploads
import upload from "../middlewares/multer.js";
// Import menu controller functions
import {
    addMenuItem,
    getAllMenuItems,
    getMenuItemById,
    getMenuItemsByCategory,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability
} from "../controllers/menuController.js";

// Create express router instance
const menuRoutes = express.Router();

// Public routes - accessible to all users
menuRoutes.get("/all", getAllMenuItems); // Get all menu items
menuRoutes.get("/:id", getMenuItemById); // Get single menu item by ID
menuRoutes.get("/category/:categoryId", getMenuItemsByCategory); // Get menu items by category

// Admin-only routes - require admin authentication
menuRoutes.post("/add", adminOnly, upload.single("image"), addMenuItem); // Add new menu item
menuRoutes.put("/update/:id", adminOnly, upload.single("image"), updateMenuItem); // Update menu item
menuRoutes.delete("/delete/:id", adminOnly, deleteMenuItem); // Delete menu item
menuRoutes.patch("/toggle/:id", adminOnly, toggleAvailability); // Toggle menu item availability

// Export the router
export default menuRoutes;
