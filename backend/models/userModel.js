// Import mongoose library to interact with MongoDB
import mongoose from "mongoose";

/**
 * User Schema Definition
 * Defines the structure of user documents in the MongoDB database
 */
const userSchema = new mongoose.Schema({
    // User's full name - required field
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true // Remove whitespace from both ends
    },
    // User's email address - required and must be unique
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // Ensures no duplicate emails in database
        lowercase: true, // Convert email to lowercase before saving
        trim: true, // Remove whitespace from both ends
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] // Email validation regex
    },
    // User's hashed password - required field
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    // Flag to indicate if user has admin privileges - defaults to false
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    // Automatically add createdAt and updatedAt timestamps to documents
    timestamps: true
});

/**
 * Create and export the User model
 * This model will be used to interact with the 'users' collection in MongoDB
 * Collection name is automatically pluralized to 'users'
 */
const User = mongoose.model("User", userSchema);

// Export the User model for use in other parts of the application
export default User;