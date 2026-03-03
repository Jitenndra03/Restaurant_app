// Import jsonwebtoken library to verify JWT tokens
import jwt from "jsonwebtoken";

/**
 * Middleware to protect routes that require authentication
 * Verifies the JWT token from cookies and attaches decoded user data to request object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized - Invalid token",
      success: false,
    });
  }
};

/**
 * Middleware to protect admin-only routes
 * Verifies JWT token and checks if the user is an admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const adminOnly = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decoded;

    if (
      req.admin.email === process.env.ADMIN_EMAIL ||
      req.admin.role === "admin"
    ) {
      next();
    } else {
      return res.status(403).json({
        message: "Forbidden - Admin access required",
        success: false,
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized - Invalid token",
      success: false,
    });
  }
};
