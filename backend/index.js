// Import required packages
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Import database connection
import {connectDB} from "./config/db.js";
// Import Cloudinary configuration
import connectCloudinary from "./config/cloudniary.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Database connection
connectDB();

// Cloudinary connection
connectCloudinary();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors({
    origin: "*", // Allow requests from the frontend URL
    credentials: true // Allow cookies to be sent with requests (required for JWT in cookies)
})); // Enable CORS with credentials
app.use(cookieParser()); // Parse cookies

// Port configuration
const PORT = process.env.PORT || 5000;

// Root route
app.get("/", (req, res) => {
    res.json({
        message: "Restaurant API is running",
        success: true,
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            category: "/api/category",
            menu: "/api/menu",
            cart: "/api/cart",
            order: "/api/order",
            reservation: "/api/reservation"
        }
    });
});

// API routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/category", categoryRoutes); // Category management routes
app.use("/api/menu", menuRoutes); // Menu management routes
app.use("/api/order", orderRoutes); // Order management routes
app.use("/api/cart", cartRoutes); // Shopping cart routes
app.use("/api/reservation", reservationRoutes); // Reservation management routes
app.use("/api/review", reviewRoutes); // Review / rating routes
app.use("/api/payment", paymentRoutes); // Razorpay payment routes

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
