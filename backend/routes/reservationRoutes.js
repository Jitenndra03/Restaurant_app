// Import express to create router
import express from "express";
// Import authentication middlewares
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
// Import reservation controller functions
import {
    createReservation,
    getAllReservations,
    getUserReservations,
    getReservationById,
    getReservationByCode,
    updateReservationStatus,
    updateReservation,
    cancelReservation,
    deleteReservation,
    getAvailableTimeSlots
} from "../controllers/reservationController.js";

// Create express router instance
const reservationRoutes = express.Router();

// Public routes
reservationRoutes.get("/available-slots", getAvailableTimeSlots); // Get available time slots for a date
reservationRoutes.get("/code/:code", getReservationByCode); // Get reservation by confirmation code

// Protected routes - require user authentication
reservationRoutes.post("/create", protect, createReservation); // Create new reservation
reservationRoutes.get("/my-reservations", protect, getUserReservations); // Get logged-in user's reservations
reservationRoutes.get("/:id", protect, getReservationById); // Get single reservation by ID
reservationRoutes.put("/update/:id", protect, updateReservation); // Update reservation details
reservationRoutes.patch("/cancel/:id", protect, cancelReservation); // Cancel a reservation

// Admin-only routes - require admin authentication
reservationRoutes.get("/", adminOnly, getAllReservations); // Get all reservations (admin view)
reservationRoutes.patch("/status/:id", adminOnly, updateReservationStatus); // Update reservation status
reservationRoutes.delete("/delete/:id", adminOnly, deleteReservation); // Delete a reservation

// Export the router
export default reservationRoutes;
