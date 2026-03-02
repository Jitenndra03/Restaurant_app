// Import mongoose library to interact with MongoDB
import mongoose from "mongoose";

/**
 * Order Schema Definition
 * Defines the structure of order documents in the MongoDB database
 * Handles customer orders with items, delivery info, and payment details
 */
const orderSchema = new mongoose.Schema({
    // Reference to the user who placed the order
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    // Array of ordered items with their details
    items: [{
        // Reference to menu item
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu',
            required: [true, 'Menu item is required']
        },
        // Quantity of this item ordered
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1']
        },
        // Price at the time of order (stored to maintain price history)
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price must be positive']
        }
    }],
    // Total amount for the entire order
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: [0, 'Total amount must be positive']
    },
    // Delivery address information
    deliveryAddress: {
        street: {
            type: String,
            required: [true, 'Street address is required'],
            trim: true
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true
        },
        zipCode: {
            type: String,
            required: [true, 'Zip code is required'],
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true
        }
    },
    // Order status tracking
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    // Payment information
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'online'],
        required: [true, 'Payment method is required']
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    // Special instructions from customer
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    // Estimated delivery time
    estimatedDeliveryTime: {
        type: Date
    },
    // Actual delivery time
    deliveredAt: {
        type: Date
    }
}, {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true
});

/**
 * Create and export the Order model
 * This model will be used to interact with the 'orders' collection in MongoDB
 */
const Order = mongoose.model('Order', orderSchema);

// Export the Order model for use in other parts of the application
export default Order;
