// Import mongoose library to interact with MongoDB
import mongoose from "mongoose";

/**
 * Menu Schema Definition
 * Defines the structure of menu item documents in the MongoDB database
 * Each menu item represents a dish or food item available in the restaurant
 */
const menuSchema = new mongoose.Schema({
    // Menu item name - required field
    name: {
        type: String,
        required: [true, 'Menu item name is required'],
        trim: true, // Remove whitespace from both ends
        minlength: [2, 'Menu item name must be at least 2 characters long'],
        maxlength: [100, 'Menu item name cannot exceed 100 characters']
    },
    // Description of the menu item - required field
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true, // Remove whitespace from both ends
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    // Price of the menu item - required field
    price: {
        type: Number, // Fixed: Changed 'number' to 'Number' (capital N)
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number'] // Ensure price is not negative
    },
    // Image URL for the menu item - stored as Cloudinary URL
    image: {
        type: String,
        required: [true, 'Menu item image is required']
    },
    // Reference to the Category model - establishes relationship between menu items and categories
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // References the Category collection
        required: [true, 'Category is required']
    },
    // Whether the item is vegetarian
    isVeg: {
        type: Boolean,
        default: true // Defaults to veg
    },
    // Average rating (computed from reviews)
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    // Number of ratings received
    ratingCount: {
        type: Number,
        default: 0
    },
    // Availability status of the menu item - defaults to true
    isAvailable: {
        type: Boolean,
        default: true // Menu items are available by default
    }
}, {
    // Automatically add createdAt and updatedAt timestamps to documents
    timestamps: true
});

/**
 * Create and export the Menu model
 * This model will be used to interact with the 'menus' collection in MongoDB
 * Collection name is automatically pluralized to 'menus'
 */
const Menu = mongoose.model('Menu', menuSchema);

// Export the Menu model for use in other parts of the application
export default Menu;