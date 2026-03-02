// Import Order model to interact with the orders collection in the database
import Order from '../models/orderModel.js';
import Menu from '../models/menuModel.js';
import Cart from '../models/cartModel.js';

/**
 * Controller function to create a new order
 * Handles order creation with item validation and total calculation
 * @param {Object} req - Express request object containing order data
 * @param {Object} res - Express response object
 */
export const createOrder = async(req, res) => {
    try {
        // Extract order details from request body
        const {items, deliveryAddress, paymentMethod, notes} = req.body;
        // Get user ID from authenticated user (set by protect middleware)
        const userId = req.user.userId;

        // Validate required fields
        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "Order must contain at least one item",
                success: false
            });
        }

        if (!deliveryAddress || !paymentMethod) {
            return res.status(400).json({
                message: "Delivery address and payment method are required",
                success: false
            });
        }

        // Validate and calculate total amount
        let totalAmount = 0;
        const orderItems = [];

        // Process each item in the order
        for (const item of items) {
            // Find the menu item in database
            const menuItem = await Menu.findById(item.menuItem);

            // Check if menu item exists
            if (!menuItem) {
                return res.status(404).json({
                    message: `Menu item with ID ${item.menuItem} not found`,
                    success: false
                });
            }

            // Check if menu item is available
            if (!menuItem.isAvailable) {
                return res.status(400).json({
                    message: `${menuItem.name} is currently not available`,
                    success: false
                });
            }

            // Validate quantity
            if (!item.quantity || item.quantity < 1) {
                return res.status(400).json({
                    message: "Invalid quantity for menu item",
                    success: false
                });
            }

            // Calculate subtotal for this item
            const itemTotal = menuItem.price * item.quantity;
            totalAmount += itemTotal;

            // Add item to order items array
            orderItems.push({
                menuItem: item.menuItem,
                quantity: item.quantity,
                price: menuItem.price // Store current price
            });
        }

        // Calculate estimated delivery time (30-45 minutes from now)
        const estimatedDeliveryTime = new Date();
        estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + 40);

        // Create the order
        const newOrder = await Order.create({
            user: userId,
            items: orderItems,
            totalAmount,
            deliveryAddress,
            paymentMethod,
            notes,
            estimatedDeliveryTime
        });

        // Clear the user's cart after successful order creation
        await Cart.findOneAndDelete({ user: userId });

        // Populate order with user and menu item details
        await newOrder.populate('user', 'name email');
        await newOrder.populate('items.menuItem', 'name image');

        // Return success response
        res.status(201).json({
            message: "Order placed successfully",
            success: true,
            order: newOrder
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
 * Controller function to get all orders (admin only)
 * Retrieves all orders with user and menu item details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllOrders = async(req, res) => {
    try {
        // Fetch all orders with populated details, sorted by creation date
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.menuItem', 'name image price')
            .sort({createdAt: -1});

        // Return success response with orders
        res.status(200).json({
            success: true,
            count: orders.length,
            orders
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
 * Controller function to get orders for the logged-in user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserOrders = async(req, res) => {
    try {
        // Get user ID from authenticated user
        const userId = req.user.userId;

        // Fetch orders for this user
        const orders = await Order.find({user: userId})
            .populate('items.menuItem', 'name image price')
            .sort({createdAt: -1});

        // Return success response with orders
        res.status(200).json({
            success: true,
            count: orders.length,
            orders
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
 * Controller function to get a single order by ID
 * @param {Object} req - Express request object containing order ID
 * @param {Object} res - Express response object
 */
export const getOrderById = async(req, res) => {
    try {
        // Extract order ID from request parameters
        const {id} = req.params;

        // Find order by ID with populated details
        const order = await Order.findById(id)
            .populate('user', 'name email')
            .populate('items.menuItem', 'name image price category');

        // If order not found, return error
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        // Check if user is authorized to view this order (owner or admin)
        if (order.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Not authorized to view this order",
                success: false
            });
        }

        // Return success response with order details
        res.status(200).json({
            success: true,
            order
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
 * Controller function to update order status (admin only)
 * @param {Object} req - Express request object containing order ID and new status
 * @param {Object} res - Express response object
 */
export const updateOrderStatus = async(req, res) => {
    try {
        // Extract order ID from request parameters
        const {id} = req.params;
        // Extract new status from request body
        const {status} = req.body;

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status value",
                success: false
            });
        }

        // Find the order
        const order = await Order.findById(id);

        // If order not found, return error
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        // Update order status
        order.status = status;

        // If status is delivered, set delivered time
        if (status === 'delivered') {
            order.deliveredAt = new Date();
            order.paymentStatus = 'paid'; // Mark payment as completed
        }

        // Save the updated order
        await order.save();

        // Populate order details
        await order.populate('user', 'name email');
        await order.populate('items.menuItem', 'name image');

        // Return success response
        res.status(200).json({
            message: "Order status updated successfully",
            success: true,
            order
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
 * Controller function to update payment status (admin only)
 * @param {Object} req - Express request object containing order ID and payment status
 * @param {Object} res - Express response object
 */
export const updatePaymentStatus = async(req, res) => {
    try {
        // Extract order ID from request parameters
        const {id} = req.params;
        // Extract payment status from request body
        const {paymentStatus} = req.body;

        // Validate payment status
        const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
        if (!paymentStatus || !validPaymentStatuses.includes(paymentStatus)) {
            return res.status(400).json({
                message: "Invalid payment status value",
                success: false
            });
        }

        // Find and update the order
        const order = await Order.findByIdAndUpdate(
            id,
            {paymentStatus},
            {new: true}
        )
        .populate('user', 'name email')
        .populate('items.menuItem', 'name image');

        // If order not found, return error
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        // Return success response
        res.status(200).json({
            message: "Payment status updated successfully",
            success: true,
            order
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
 * Controller function to cancel an order
 * Users can cancel their own orders if status is 'pending' or 'confirmed'
 * @param {Object} req - Express request object containing order ID
 * @param {Object} res - Express response object
 */
export const cancelOrder = async(req, res) => {
    try {
        // Extract order ID from request parameters
        const {id} = req.params;
        // Get user ID from authenticated user
        const userId = req.user.userId;

        // Find the order
        const order = await Order.findById(id);

        // If order not found, return error
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        // Check if user is authorized to cancel this order
        if (order.user.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Not authorized to cancel this order",
                success: false
            });
        }

        // Check if order can be cancelled
        if (order.status === 'delivered' || order.status === 'cancelled') {
            return res.status(400).json({
                message: `Cannot cancel order with status: ${order.status}`,
                success: false
            });
        }

        // Update order status to cancelled
        order.status = 'cancelled';
        await order.save();

        // Populate order details
        await order.populate('user', 'name email');
        await order.populate('items.menuItem', 'name image');

        // Return success response
        res.status(200).json({
            message: "Order cancelled successfully",
            success: true,
            order
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
 * Controller function to delete an order (admin only)
 * @param {Object} req - Express request object containing order ID
 * @param {Object} res - Express response object
 */
export const deleteOrder = async(req, res) => {
    try {
        // Extract order ID from request parameters
        const {id} = req.params;

        // Find and delete the order
        const order = await Order.findByIdAndDelete(id);

        // If order not found, return error
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        // Return success response
        res.status(200).json({
            message: "Order deleted successfully",
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
