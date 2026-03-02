// Import Cart model to interact with the carts collection in the database
import Cart from '../models/cartModel.js';
// Import Menu model to verify menu items exist and are available
import Menu from '../models/menuModel.js';

/**
 * Controller function to add an item to the cart
 * If the user has no cart, a new one is created.
 * If the item already exists in the cart, its quantity is incremented.
 * If the item is new, it is pushed to the cart items array.
 *
 * @param {Object} req - Express request object containing menuItem ID and quantity in body
 * @param {Object} res - Express response object
 */
export const addToCart = async (req, res) => {
    try {
        // Extract menu item ID and quantity from request body
        const { menuItem, quantity } = req.body;
        // Get user ID from authenticated user (set by protect middleware)
        const userId = req.user.userId;

        // Validate that menu item ID is provided
        if (!menuItem) {
            return res.status(400).json({
                message: "Menu item ID is required",
                success: false
            });
        }

        // Default quantity to 1 if not provided
        const qty = quantity && quantity >= 1 ? quantity : 1;

        // Verify the menu item exists in the database
        const menuItemExists = await Menu.findById(menuItem);
        if (!menuItemExists) {
            return res.status(404).json({
                message: "Menu item not found",
                success: false
            });
        }

        // Check if the menu item is currently available
        if (!menuItemExists.isAvailable) {
            return res.status(400).json({
                message: `${menuItemExists.name} is currently not available`,
                success: false
            });
        }

        // Find the user's existing cart, or create a new one
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create a new cart for the user with the first item
            cart = await Cart.create({
                user: userId,
                items: [{ menuItem, quantity: qty }]
            });
        } else {
            // Check if the item already exists in the cart
            const existingItemIndex = cart.items.findIndex(
                (item) => item.menuItem.toString() === menuItem
            );

            if (existingItemIndex > -1) {
                // If item exists, increment its quantity
                cart.items[existingItemIndex].quantity += qty;
            } else {
                // If item is new, push it to the items array
                cart.items.push({ menuItem, quantity: qty });
            }

            // Save the updated cart to the database
            await cart.save();
        }

        // Populate menu item details for the response
        await cart.populate('items.menuItem', 'name image price isAvailable');

        // Return success response with updated cart
        res.status(200).json({
            message: "Item added to cart successfully",
            success: true,
            cart
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
 * Controller function to get the current user's cart
 * Returns the cart with fully populated menu item details.
 * If the user has no cart, returns an empty items array.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getCart = async (req, res) => {
    try {
        // Get user ID from authenticated user
        const userId = req.user.userId;

        // Find the user's cart and populate menu item details
        const cart = await Cart.findOne({ user: userId })
            .populate('items.menuItem', 'name image price isAvailable category');

        // If no cart exists, return an empty cart structure
        if (!cart) {
            return res.status(200).json({
                success: true,
                cart: { items: [] }
            });
        }

        // Return success response with cart data
        res.status(200).json({
            success: true,
            cart
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
 * Controller function to remove a specific item from the cart
 * Filters out the item matching the given menu item ID.
 *
 * @param {Object} req - Express request object containing menuItem ID in params
 * @param {Object} res - Express response object
 */
export const removeFromCart = async (req, res) => {
    try {
        // Extract menu item ID from URL parameters
        const { menuItemId } = req.params;
        // Get user ID from authenticated user
        const userId = req.user.userId;

        // Find the user's cart
        const cart = await Cart.findOne({ user: userId });

        // If no cart exists, return error
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            });
        }

        // Filter out the item to be removed from the cart items array
        const originalLength = cart.items.length;
        cart.items = cart.items.filter(
            (item) => item.menuItem.toString() !== menuItemId
        );

        // Check if any item was actually removed
        if (cart.items.length === originalLength) {
            return res.status(404).json({
                message: "Item not found in cart",
                success: false
            });
        }

        // Save the updated cart
        await cart.save();

        // Populate menu item details for the response
        await cart.populate('items.menuItem', 'name image price isAvailable');

        // Return success response with updated cart
        res.status(200).json({
            message: "Item removed from cart successfully",
            success: true,
            cart
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
 * Controller function to update the quantity of a specific cart item
 * Sets the quantity to the provided value. If quantity is 0 or less, the item is removed.
 *
 * @param {Object} req - Express request object containing menuItemId in params and quantity in body
 * @param {Object} res - Express response object
 */
export const updateCartItemQuantity = async (req, res) => {
    try {
        // Extract menu item ID from URL parameters
        const { menuItemId } = req.params;
        // Extract new quantity from request body
        const { quantity } = req.body;
        // Get user ID from authenticated user
        const userId = req.user.userId;

        // Validate that quantity is provided
        if (quantity === undefined || quantity === null) {
            return res.status(400).json({
                message: "Quantity is required",
                success: false
            });
        }

        // Find the user's cart
        const cart = await Cart.findOne({ user: userId });

        // If no cart exists, return error
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            });
        }

        // Find the item in the cart
        const itemIndex = cart.items.findIndex(
            (item) => item.menuItem.toString() === menuItemId
        );

        // If item not found in cart, return error
        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Item not found in cart",
                success: false
            });
        }

        if (quantity <= 0) {
            // If quantity is 0 or less, remove the item from the cart
            cart.items.splice(itemIndex, 1);
        } else {
            // Update the quantity to the new value
            cart.items[itemIndex].quantity = quantity;
        }

        // Save the updated cart
        await cart.save();

        // Populate menu item details for the response
        await cart.populate('items.menuItem', 'name image price isAvailable');

        // Return success response with updated cart
        res.status(200).json({
            message: "Cart updated successfully",
            success: true,
            cart
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
 * Controller function to clear all items from the cart
 * Removes every item from the user's cart, leaving it empty.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const clearCart = async (req, res) => {
    try {
        // Get user ID from authenticated user
        const userId = req.user.userId;

        // Find the user's cart
        const cart = await Cart.findOne({ user: userId });

        // If no cart exists, return error
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            });
        }

        // Clear all items from the cart
        cart.items = [];

        // Save the empty cart
        await cart.save();

        // Return success response
        res.status(200).json({
            message: "Cart cleared successfully",
            success: true,
            cart
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
