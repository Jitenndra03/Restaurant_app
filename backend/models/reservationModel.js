// Import mongoose library to interact with MongoDB
import mongoose from "mongoose";

/**
 * Reservation Schema Definition
 * Defines the structure of table reservation documents in the MongoDB database
 * Handles customer table bookings for dining at the restaurant
 */
const reservationSchema = new mongoose.Schema({
    // Reference to the user making the reservation
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    // Customer name for the reservation
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    // Customer email
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    // Customer phone number
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    // Number of guests
    numberOfGuests: {
        type: Number,
        required: [true, 'Number of guests is required'],
        min: [1, 'At least 1 guest is required'],
        max: [20, 'Maximum 20 guests allowed per reservation']
    },
    // Date of reservation
    reservationDate: {
        type: Date,
        required: [true, 'Reservation date is required'],
        validate: {
            validator: function(value) {
                // Ensure reservation date is not in the past
                return value >= new Date();
            },
            message: 'Reservation date cannot be in the past'
        }
    },
    // Time slot for the reservation
    reservationTime: {
        type: String,
        required: [true, 'Reservation time is required'],
        
    },
    // Table number (assigned by admin/system)
    tableNumber: {
        type: Number,
        min: [1, 'Table number must be positive']
    },
    // Special requests or dietary requirements
    specialRequests: {
        type: String,
        trim: true,
        maxlength: [500, 'Special requests cannot exceed 500 characters']
    },
    // Reservation status
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no-show'],
        default: 'pending'
    },
    // Occasion (optional)
    occasion: {
        type: String,
        enum: ['birthday', 'anniversary', 'business', 'casual', 'other'],
        trim: true
    },
    // Confirmation code (generated automatically)
    confirmationCode: {
        type: String,
        unique: true
    }
}, {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true
});

/**
 * Pre-save middleware to generate confirmation code
 */
reservationSchema.pre('save', function() {
    if (!this.confirmationCode) {
        this.confirmationCode =
            'RSV' +
            Date.now().toString(36).toUpperCase() +
            Math.random().toString(36).substring(2, 7).toUpperCase();
    }
});

/**
 * Create and export the Reservation model
 * This model will be used to interact with the 'reservations' collection in MongoDB
 */
const Reservation = mongoose.model('Reservation', reservationSchema);

// Export the Reservation model for use in other parts of the application
export default Reservation;
