// Import mongoose library to interact with MongoDB
import mongoose from "mongoose";

/**
 * Cart Schema Definition
 * Defines the structure of shopping cart documents in the MongoDB database.
 * Each cart belongs to a single user and contains an array of menu items with quantities.
 *
 * Design: One cart per user. When the user places an order, the cart can be cleared.
 * Items reference the Menu model so that item details (name, price, image) can be populated.
 */
const cartSchema = new mongoose.Schema({
    // Reference to the user who owns this cart - one cart per user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        unique: true // Ensures only one cart per user in the database
    },
    // Array of cart items, each containing a menu item reference and quantity
    items: [{
        // Reference to the menu item being added to the cart
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu',
            required: [true, 'Menu item is required']
        },
        // Quantity of this menu item in the cart
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1'],
            default: 1
        }
    }]
}, {
    // Automatically add createdAt and updatedAt timestamps to documents
    timestamps: true
});

/**
 * Create and export the Cart model
 * This model will be used to interact with the 'carts' collection in MongoDB.
 * Collection name is automatically pluralized to 'carts'.
 */
const Cart = mongoose.model('Cart', cartSchema);

// Export the Cart model for use in other parts of the application
export default Cart;
