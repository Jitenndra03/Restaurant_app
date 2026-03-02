// Import mongoose library to interact with MongoDB
import mongoose from "mongoose";

/**
 * Category Schema Definition
 * Defines the structure of category documents in the MongoDB database
 * Categories are used to organize menu items (e.g., Appetizers, Main Course, Desserts, Beverages)
 */
const categorySchema = new mongoose.Schema({
    // Category name - required field and must be unique
    name: {
        type: String,
        required: [true, 'Category name is required'], // Custom error message if name is missing
        unique: true, // Ensures no duplicate category names in database
        trim: true, // Remove whitespace from both ends
        minlength: [2, 'Category name must be at least 2 characters long'], // Minimum length validation
        maxlength: [50, 'Category name cannot exceed 50 characters'] // Maximum length validation
    },
    // Category image URL - stored as Cloudinary URL
    image: {
        type: String,
        required: [true, 'Category image is required'] // Image is required for visual representation
    }
}, {
    // Automatically add createdAt and updatedAt timestamps to documents
    timestamps: true
});

/**
 * Create and export the Category model
 * This model will be used to interact with the 'categories' collection in MongoDB
 * Collection name is automatically pluralized to 'categories'
 */
const Category = mongoose.model("Category", categorySchema);

// Export the Category model for use in other parts of the application
export default Category;