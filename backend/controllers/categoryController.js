// Import Category model to interact with the categories collection in the database
import Category from '../models/categoryModel.js';
// Import Cloudinary v2 API for image upload functionality
import {v2 as cloudinary} from 'cloudinary';

/**
 * Controller function to add a new category
 * Handles category creation with image upload to Cloudinary
 * @param {Object} req - Express request object containing category name and image file
 * @param {Object} res - Express response object
 */
export const addCategory = async(req, res) => {
    try {
        // Extract category name from request body
        const {name} = req.body;

        // Validate that both name and image file are provided
        if(!name || !req.file){
            return res.status(400).json({
                message: "Please provide both category name and image",
                success: false
            });
        }

        // Check if a category with the same name already exists in the database
        const alreadyExists = await Category.findOne({name});
        if(alreadyExists){
            return res.status(400).json({
                message: "Category already exists",
                success: false
            });
        }

        // Upload the image file to Cloudinary and get the secure URL
        const result = await cloudinary.uploader.upload(req.file.path);

        // Create a new category in the database with name and image URL
        const newCategory = await Category.create({
            name,
            image: result.secure_url // Store the Cloudinary secure URL
        });

        // Return success response with the newly created category
        res.status(201).json({
            message: "Category added successfully",
            success: true,
            category: newCategory
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
 * Controller function to get all categories
 * Retrieves all categories from the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllCategories = async(req, res) => {
    try {
        // Fetch all categories from the database, sorted by creation date (newest first)
        const categories = await Category.find().sort({createdAt: -1});

        // Return success response with the list of categories
        res.status(200).json({
            success: true,
            count: categories.length,
            categories
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
 * Controller function to delete a category by ID
 * Removes a category from the database
 * @param {Object} req - Express request object containing category ID in params
 * @param {Object} res - Express response object
 */
export const deleteCategory = async(req, res) => {
    try {
        // Extract category ID from request parameters
        const {id} = req.params;

        // Find and delete the category by ID
        const category = await Category.findByIdAndDelete(id);

        // If category not found, return error
        if(!category){
            return res.status(404).json({
                message: "Category not found",
                success: false
            });
        }

        // Return success response
        res.status(200).json({
            message: "Category deleted successfully",
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
 * Controller function to update a category by ID
 * Updates category name and/or image
 * @param {Object} req - Express request object containing category ID in params and update data in body
 * @param {Object} res - Express response object
 */
export const updateCategory = async(req, res) => {
    try {
        // Extract category ID from request parameters
        const {id} = req.params;
        // Extract new category name from request body
        const {name} = req.body;

        // Find the category by ID in the database
        const category = await Category.findById(id);

        // If category not found, return 404 error
        if(!category){
            return res.status(404).json({
                message: "Category not found",
                success: false
            });
        }

        // If a new image file is provided, upload it to Cloudinary
        if(req.file){
            // Upload the new image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
            // Update category image with new Cloudinary URL
            category.image = result.secure_url;
        }

        // If a new name is provided, update the category name
        if(name) {
            category.name = name;
        }

        // Save the updated category to the database
        await category.save();

        // Return success response with updated category data
        res.status(200).json({
            message: "Category updated successfully",
            success: true,
            category
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