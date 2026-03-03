// Import jsonwebtoken library to verify JWT tokens
import jwt from "jsonwebtoken";

/**
 * Middleware to protect routes that require authentication
 * Verifies the JWT token from cookies and attaches decoded user data to request object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const protect=(req,res,next)=>{
    // Extract the token from cookies sent by the client
    const token=req.cookies.token;
    console.log(token);
    console.log(req.cookies);

    // Check if token exists in the request
    if(!token){
        // Return 401 Unauthorized if no token is found
        return res.status(401).json({message:"Unauthorized - No token provided", success:false});
    }

    try {
        // Verify the token using the JWT secret from environment variables
        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        // Attach the decoded user information to the request object for use in subsequent middleware/routes
        req.user=decoded;

        // Call next() to pass control to the next middleware or route handler
        next();
    } catch (error) {
        // Return 401 Unauthorized if token verification fails (invalid or expired token)
        return res.status(401).json({message:"Unauthorized - Invalid token", success:false});
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
