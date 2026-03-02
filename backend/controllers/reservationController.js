// Import Reservation model to interact with the reservations collection in the database
import Reservation from '../models/reservationModel.js';

/**
 * Controller function to create a new reservation
 * Handles table booking with validation
 * @param {Object} req - Express request object containing reservation data
 * @param {Object} res - Express response object
 */
export const createReservation = async(req, res) => {
    try {
        // Extract reservation details from request body
        const {name, email, phone, numberOfGuests, reservationDate, reservationTime, specialRequests, occasion} = req.body;
        // Get user ID from authenticated user
        const userId = req.user.userId;

        // Validate required fields
        if (!name || !email || !phone || !numberOfGuests || !reservationDate || !reservationTime) {
            return res.status(400).json({
                message: "Please provide all required fields",
                success: false
            });
        }

        // Check if the date is not in the past
        const selectedDate = new Date(reservationDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return res.status(400).json({
                message: "Cannot make reservation for past dates",
                success: false
            });
        }

        // Check if there's already a reservation for this time slot (limit reservations per time slot)
        const existingReservations = await Reservation.countDocuments({
            reservationDate: selectedDate,
            reservationTime,
            status: {$in: ['pending', 'confirmed', 'seated']}
        });

        // Limit to 10 reservations per time slot
        if (existingReservations >= 10) {
            return res.status(400).json({
                message: "This time slot is fully booked. Please choose another time.",
                success: false
            });
        }

        // Create the reservation
        const newReservation = await Reservation.create({
            user: userId,
            name,
            email,
            phone,
            numberOfGuests,
            reservationDate: selectedDate,
            reservationTime,
            specialRequests,
            occasion
        });

        // Populate user details
        await newReservation.populate('user', 'name email');

        // Return success response
        res.status(201).json({
            message: "Reservation created successfully",
            success: true,
            reservation: newReservation
        });
    } catch (error) {
        // Log error message to console for debugging
        console.log(error.message);
        // Return 500 Internal Server Error if something goes wrong
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

/**
 * Controller function to get all reservations (admin only)
 * Retrieves all reservations with user details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllReservations = async(req, res) => {
    try {
        // Fetch all reservations with user details, sorted by date and time
        const reservations = await Reservation.find()
            .populate('user', 'name email')
            .sort({reservationDate: 1, reservationTime: 1});

        // Return success response with reservations
        res.status(200).json({
            success: true,
            count: reservations.length,
            reservations
        });
    } catch (error) {
        // Log error message to console for debugging
        console.log(error.message);
        // Return 500 Internal Server Error if something goes wrong
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

/**
 * Controller function to get reservations for the logged-in user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserReservations = async(req, res) => {
    try {
        // Get user ID from authenticated user
        const userId = req.user.userId;

        // Fetch reservations for this user
        const reservations = await Reservation.find({user: userId})
            .sort({reservationDate: -1});

        // Return success response with reservations
        res.status(200).json({
            success: true,
            count: reservations.length,
            reservations
        });
    } catch (error) {
        // Log error message to console for debugging
        console.log(error.message);
        // Return 500 Internal Server Error if something goes wrong
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

/**
 * Controller function to get a single reservation by ID
 * @param {Object} req - Express request object containing reservation ID
 * @param {Object} res - Express response object
 */
export const getReservationById = async(req, res) => {
    try {
        // Extract reservation ID from request parameters
        const {id} = req.params;

        // Find reservation by ID with user details
        const reservation = await Reservation.findById(id)
            .populate('user', 'name email');

        // If reservation not found, return error
        if (!reservation) {
            return res.status(404).json({
                message: "Reservation not found",
                success: false
            });
        }

        // Check if user is authorized to view this reservation (owner or admin)
        if (reservation.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Not authorized to view this reservation",
                success: false
            });
        }

        // Return success response with reservation details
        res.status(200).json({
            success: true,
            reservation
        });
    } catch (error) {
        // Log error message to console for debugging
        console.log(error.message);
        // Return 500 Internal Server Error if something goes wrong
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

/**
 * Controller function to get reservation by confirmation code
 * @param {Object} req - Express request object containing confirmation code
 * @param {Object} res - Express response object
 */
export const getReservationByCode = async(req, res) => {
    try {
        // Extract confirmation code from request parameters
        const {code} = req.params;

        // Find reservation by confirmation code
        const reservation = await Reservation.findOne({confirmationCode: code})
            .populate('user', 'name email');

        // If reservation not found, return error
        if (!reservation) {
            return res.status(404).json({
                message: "Reservation not found with this confirmation code",
                success: false
            });
        }

        // Return success response with reservation details
        res.status(200).json({
            success: true,
            reservation
        });
    } catch (error) {
        // Log error message to console for debugging
        console.log(error.message);
        // Return 500 Internal Server Error if something goes wrong
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

/**
 * Controller function to update reservation status (admin only)
 * @param {Object} req - Express request object containing reservation ID and new status
 * @param {Object} res - Express response object
 */
export const updateReservationStatus = async(req, res) => {
    try {
        // Extract reservation ID from request parameters
        const {id} = req.params;
        // Extract new status and table number from request body
        const {status, tableNumber} = req.body;

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no-show'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status value",
                success: false
            });
        }

        // Find the reservation
        const reservation = await Reservation.findById(id);

        // If reservation not found, return error
        if (!reservation) {
            return res.status(404).json({
                message: "Reservation not found",
                success: false
            });
        }

        // Update reservation status
        reservation.status = status;

        // Update table number if provided
        if (tableNumber) {
            reservation.tableNumber = tableNumber;
        }

        // Save the updated reservation
        await reservation.save();

        // Populate user details
        await reservation.populate('user', 'name email');

        // Return success response
        res.status(200).json({
            message: "Reservation status updated successfully",
            success: true,
            reservation
        });
    } catch (error) {
        // Log error message to console for debugging
        console.log(error.message);
        // Return 500 Internal Server Error if something goes wrong
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

/**
 * Controller function to update reservation details
 * Users can update their own reservations if status is 'pending'
 * @param {Object} req - Express request object containing reservation ID and update data
 * @param {Object} res - Express response object
 */
export const updateReservation = async(req, res) => {
    try {
        // Extract reservation ID from request parameters
        const {id} = req.params;
        // Extract update fields from request body
        const {numberOfGuests, reservationDate, reservationTime, specialRequests, occasion} = req.body;
        // Get user ID from authenticated user
        const userId = req.user.userId;

        // Find the reservation
        const reservation = await Reservation.findById(id);

        // If reservation not found, return error
        if (!reservation) {
            return res.status(404).json({
                message: "Reservation not found",
                success: false
            });
        }

        // Check if user is authorized to update this reservation
        if (reservation.user.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Not authorized to update this reservation",
                success: false
            });
        }

        // Check if reservation can be updated (only pending reservations)
        if (reservation.status !== 'pending' && req.user.role !== 'admin') {
            return res.status(400).json({
                message: "Cannot update reservation with current status",
                success: false
            });
        }

        // Update fields if provided
        if (numberOfGuests) reservation.numberOfGuests = numberOfGuests;
        if (reservationDate) reservation.reservationDate = new Date(reservationDate);
        if (reservationTime) reservation.reservationTime = reservationTime;
        if (specialRequests !== undefined) reservation.specialRequests = specialRequests;
        if (occasion) reservation.occasion = occasion;

        // Save the updated reservation
        await reservation.save();

        // Populate user details
        await reservation.populate('user', 'name email');

        // Return success response
        res.status(200).json({
            message: "Reservation updated successfully",
            success: true,
            reservation
        });
    } catch (error) {
        // Log error message to console for debugging
        console.log(error.message);
        // Return 500 Internal Server Error if something goes wrong
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

/**
 * Controller function to cancel a reservation
 * Users can cancel their own reservations
 * @param {Object} req - Express request object containing reservation ID
 * @param {Object} res - Express response object
 */
export const cancelReservation = async(req, res) => {
    try {
        // Extract reservation ID from request parameters
        const {id} = req.params;
        // Get user ID from authenticated user
        const userId = req.user.userId;

        // Find the reservation
        const reservation = await Reservation.findById(id);

        // If reservation not found, return error
        if (!reservation) {
            return res.status(404).json({
                message: "Reservation not found",
                success: false
            });
        }

        // Check if user is authorized to cancel this reservation
        if (reservation.user.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Not authorized to cancel this reservation",
                success: false
            });
        }

        // Check if reservation can be cancelled
        if (reservation.status === 'completed' || reservation.status === 'cancelled') {
            return res.status(400).json({
                message: `Cannot cancel reservation with status: ${reservation.status}`,
                success: false
            });
        }

        // Update reservation status to cancelled
        reservation.status = 'cancelled';
        await reservation.save();

        // Populate user details
        await reservation.populate('user', 'name email');

        // Return success response
        res.status(200).json({
            message: "Reservation cancelled successfully",
            success: true,
            reservation
        });
    } catch (error) {
        // Log error message to console for debugging
        console.log(error.message);
        // Return 500 Internal Server Error if something goes wrong
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

/**
 * Controller function to delete a reservation (admin only)
 * @param {Object} req - Express request object containing reservation ID
 * @param {Object} res - Express response object
 */
export const deleteReservation = async(req, res) => {
    try {
        // Extract reservation ID from request parameters
        const {id} = req.params;

        // Find and delete the reservation
        const reservation = await Reservation.findByIdAndDelete(id);

        // If reservation not found, return error
        if (!reservation) {
            return res.status(404).json({
                message: "Reservation not found",
                success: false
            });
        }

        // Return success response
        res.status(200).json({
            message: "Reservation deleted successfully",
            success: true
        });
    } catch (error) {
        // Log error message to console for debugging
        console.log(error.message);
        // Return 500 Internal Server Error if something goes wrong
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

/**
 * Controller function to get available time slots for a specific date
 * @param {Object} req - Express request object containing date
 * @param {Object} res - Express response object
 */
export const getAvailableTimeSlots = async(req, res) => {
    try {
        // Extract date from query parameters
        const {date} = req.query;

        if (!date) {
            return res.status(400).json({
                message: "Date is required",
                success: false
            });
        }

        const selectedDate = new Date(date);

        // All available time slots
        const allTimeSlots = [
            '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
            '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
            '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
            '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM'
        ];

        // Get reservations for the selected date
        const reservations = await Reservation.find({
            reservationDate: selectedDate,
            status: {$in: ['pending', 'confirmed', 'seated']}
        });

        // Count reservations per time slot
        const timeSlotCounts = {};
        reservations.forEach(reservation => {
            timeSlotCounts[reservation.reservationTime] = (timeSlotCounts[reservation.reservationTime] || 0) + 1;
        });

        // Filter available time slots (less than 10 reservations)
        const availableSlots = allTimeSlots.filter(slot => {
            return (timeSlotCounts[slot] || 0) < 10;
        });

        // Return available time slots
        res.status(200).json({
            success: true,
            date: selectedDate,
            availableSlots,
            totalSlots: allTimeSlots.length,
            availableCount: availableSlots.length
        });
    } catch (error) {
        // Log error message to console for debugging
        console.log(error.message);
        // Return 500 Internal Server Error if something goes wrong
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
