// Import express to create router
import express from "express";
// Import controller functions for authentication operations
import { loginUser, logoutUser, adminLogin, registerUser, getProfile, isAuth } from "../controllers/authControllers.js";
// Import protect middleware to guard routes that require authentication
import { protect } from "../middlewares/authMiddleware.js";

/**
 * Authentication Routes
 * Handles user registration, login, logout, admin login, and profile access.
 *
 * Endpoints:
 *   POST /api/auth/register     - Register a new user (public)
 *   POST /api/auth/login        - Login an existing user (public)
 *   POST /api/auth/logout       - Logout the current user (public)
 *   POST /api/auth/admin/login  - Login as admin using env credentials (public)
 *   GET  /api/auth/profile      - Get logged-in user's profile (protected)
 *   GET  /api/auth/is-auth      - Verify if the current session is valid (protected)
 */
const authRoutes = express.Router();

// Public routes - no authentication required
authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/logout", logoutUser);
authRoutes.post("/admin/login", adminLogin);

// Protected routes - require valid JWT token
authRoutes.get("/profile", protect, getProfile);
authRoutes.get("/is-auth", protect, isAuth);

export default authRoutes;
