// Import Menu model to interact with the menu items collection in the database
import Menu from '../models/menuModel.js';
// Import Cloudinary v2 API for image upload functionality
import {v2 as cloudinary} from 'cloudinary';

/**
 * Controller function to add a new menu item
 * Handles menu item creation with image upload to Cloudinary
 * @param {Object} req - Express request object containing menu item data and image file
 * @param {Object} res - Express response object
 */
export const addMenuItem = async(req, res) => {
    try {
        // Extract menu item details from request body
        const {name, description, price, category} = req.body;

        // Validate that all required fields are provided
        if (!name || !description || !price || !category || !req.file) {
            return res.status(400).json({
                message: "Please provide all required fields including image",
                success: false
            });
        }

        // Upload the image file to Cloudinary and get the secure URL
        const uploadResult = await cloudinary.uploader.upload(req.file.path);

        // Create a new menu item in the database
        const newMenuItem = await Menu.create({
            name,
            description,
            price,
            category,
            image: uploadResult.secure_url, // Store the Cloudinary secure URL
            isVeg: req.body.isVeg !== undefined ? req.body.isVeg : true
        });

        // Return success response with the newly created menu item
        res.status(201).json({
            message: "Menu item added successfully",
            success: true,
            menuItem: newMenuItem
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
 * Controller function to get all menu items
 * Retrieves all menu items with their associated category information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllMenuItems = async(req, res) => {
    try {
        // Fetch all menu items from database, populate category details, and sort by creation date
        const menuItems = await Menu.find()
            .populate('category', 'name image') // Populate category with name and image
            .sort({createdAt: -1}); // Sort by newest first

        // Return success response with the list of menu items
        res.status(200).json({
            success: true,
            count: menuItems.length,
            menuItems
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
 * Controller function to get a single menu item by ID
 * @param {Object} req - Express request object containing menu item ID in params
 * @param {Object} res - Express response object
 */
export const getMenuItemById = async(req, res) => {
    try {
        // Extract menu item ID from request parameters
        const {id} = req.params;

        // Find menu item by ID and populate category information
        const menuItem = await Menu.findById(id).populate('category', 'name image');

        // If menu item not found, return error
        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found",
                success: false
            });
        }

        // Return success response with menu item data
        res.status(200).json({
            success: true,
            menuItem
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
 * Controller function to get menu items by category
 * @param {Object} req - Express request object containing category ID in params
 * @param {Object} res - Express response object
 */
export const getMenuItemsByCategory = async(req, res) => {
    try {
        // Extract category ID from request parameters
        const {categoryId} = req.params;

        // Find all menu items that belong to the specified category
        const menuItems = await Menu.find({category: categoryId})
            .populate('category', 'name image')
            .sort({createdAt: -1});

        // Return success response with filtered menu items
        res.status(200).json({
            success: true,
            count: menuItems.length,
            menuItems
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
 * Controller function to update a menu item by ID
 * Updates menu item details and/or image
 * @param {Object} req - Express request object containing menu item ID and update data
 * @param {Object} res - Express response object
 */
export const updateMenuItem = async(req, res) => {
    try {
        // Extract menu item ID from request parameters
        const {id} = req.params;
        // Extract update fields from request body
        const {name, description, price, category, isAvailable} = req.body;

        // Find the menu item by ID
        const menuItem = await Menu.findById(id);

        // If menu item not found, return 404 error
        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found",
                success: false
            });
        }

        // If a new image file is provided, upload it to Cloudinary
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path);
            menuItem.image = uploadResult.secure_url;
        }

        // Update fields if provided
        if (name) menuItem.name = name;
        if (description) menuItem.description = description;
        if (price) menuItem.price = price;
        if (category) menuItem.category = category;
        if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;
        if (req.body.isVeg !== undefined) menuItem.isVeg = req.body.isVeg;

        // Save the updated menu item to the database
        await menuItem.save();

        // Return success response with updated menu item
        res.status(200).json({
            message: "Menu item updated successfully",
            success: true,
            menuItem
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
 * Controller function to delete a menu item by ID
 * Removes a menu item from the database
 * @param {Object} req - Express request object containing menu item ID in params
 * @param {Object} res - Express response object
 */
export const deleteMenuItem = async(req, res) => {
    try {
        // Extract menu item ID from request parameters
        const {id} = req.params;

        // Find and delete the menu item by ID
        const menuItem = await Menu.findByIdAndDelete(id);

        // If menu item not found, return error
        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found",
                success: false
            });
        }

        // Return success response
        res.status(200).json({
            message: "Menu item deleted successfully",
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
 * Controller function to toggle menu item availability
 * @param {Object} req - Express request object containing menu item ID
 * @param {Object} res - Express response object
 */
export const toggleAvailability = async(req, res) => {
    try {
        // Extract menu item ID from request parameters
        const {id} = req.params;

        // Find the menu item by ID
        const menuItem = await Menu.findById(id);

        // If menu item not found, return error
        if (!menuItem) {
            return res.status(404).json({
                message: "Menu item not found",
                success: false
            });
        }

        // Toggle the availability status
        menuItem.isAvailable = !menuItem.isAvailable;

        // Save the updated menu item
        await menuItem.save();

        // Return success response
        res.status(200).json({
            message: `Menu item ${menuItem.isAvailable ? 'enabled' : 'disabled'} successfully`,
            success: true,
            menuItem
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