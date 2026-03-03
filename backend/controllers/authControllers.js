// Import the User model to interact with the users collection in the database
import User from '../models/userModel.js';
// Import jsonwebtoken library to create and verify JWT tokens
import jwt from "jsonwebtoken";
// Import bcrypt library to hash passwords and compare hashed passwords
import bcrypt from "bcrypt";

// Detect production: Render sets RENDER=true, Vercel sets VERCEL=1
const isProduction = process.env.NODE_ENV === "production" || !!process.env.RENDER || !!process.env.VERCEL;

// Function to generate JWT token and set it as an HTTP-only cookie
// Takes response object and payload (user data) as parameters
const generateToken=(res,payload)=>{
    // Create a JWT token with the payload, secret key from environment variables, and expiration time of 1 day
    const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1d'});
    // Set the token as an HTTP-only cookie in the response
    res.cookie("token", token,{
        httpOnly:true, // Cookie cannot be accessed via JavaScript (prevents XSS attacks)
        secure: isProduction, // Cookie is only sent over HTTPS in production
        sameSite: isProduction ? "none" : "strict", // 'none' for cross-origin in production, 'strict' for local dev
        maxAge:24*60*60*1000 // Cookie expires in 24 hours (in milliseconds)
    });
    // Return the generated token
    return token;
}

// Controller function to register a new user
export const registerUser=async (req,res)=>{
    try {
        // Extract name, email, and password from the request body
        const {name,email,password}=req.body;

        // Validate that all required fields are provided
        if(!name || !email || !password){
            // Return 400 Bad Request if any field is missing
            return res.status(400).json({message:"Please fill all the fields", success:false});
        }

        // Check if a user with the same email already exists in the database
        const existingUser= await User.findOne({email});

        // If user exists, return error message
        if(existingUser){
            return res.status(400).json({message:"User already exists", success:false});
        }

        // Hash the password with a salt rounds of 10 for security
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database with the provided details and hashed password
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate JWT token and set it as a cookie with the user's ID as payload
        generateToken(res, {userId: newUser._id});

        // Return success response with user details (excluding password)
        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch(error){
        // Log error message to console for debugging
        console.log(error.message);
        // Return 500 Internal Server Error if something goes wrong
        return res.status(500).json({message:"Internal Server Error", success:false});
    }
}

// Controller function to log in an existing user
export const loginUser=async(req, res)=>{
    try{
        // Extract email and password from the request body
        const {email, password}=req.body;

        // Validate that both email and password are provided
        if(!email || !password){
            // Return 400 Bad Request if any field is missing
            return res.status(400).json({message:"Please fill all the fields", success:false});
        }

        // Find user in the database by email
        const user=await User.findOne({email});

        // If user doesn't exist, return error message
        if(!user){
            // Return 404 Not Found if user doesn't exist
            return res.status(404).json({message:"User not found", success:false});
        }

        // Compare the provided password with the hashed password stored in the database
        const isMatch=await bcrypt.compare(password, user.password);

        // If passwords don't match, return error message
        if(!isMatch){
            // Return 401 Unauthorized if credentials are invalid
            return res.status(401).json({message:"Invalid credentials", success:false});
        }

        // Generate JWT token with user ID and role (admin or user)
        generateToken(res, {userId: user._id, role:user.isAdmin?"admin":"user"});

        // Return success response with user details (excluding password)
        res.status(200).json({
            message : "User logged in successfully",
            success : true,
            user:{
                id: user._id,
                name:user.name,
                email:user.email,
                role:user.isAdmin?"admin":"user"
            }
        })
    } catch(error){
        // Log error message to console for debugging
        console.log(error.message);
        // Return 500 Internal Server Error if something goes wrong
        return res.status(500).json({message:"Internal Server Error", success:false});
    }
}

// Controller function to log out the current user
export const logoutUser = (req, res) => {
    try {
        // Clear the token cookie from the browser by removing it
        res.clearCookie("token", {
            httpOnly: true, // Cookie cannot be accessed via JavaScript
            secure: isProduction, // Cookie is only sent over HTTPS in production
            sameSite: isProduction ? "none" : "strict" // Match the setting used when the cookie was created
        });
        // Return success response
        return res.status(200).json({
            message: "User logged out successfully",
            success: true
        });
    } catch (error) {
        // Log error message to console for debugging
        console.log(error.message);
        // Return 500 Internal Server Error if something goes wrong
        return res.status(500).json({message: "Internal Server Error", success: false});
    }
}

// Controller function to login for admin
export const adminLogin=async(req,res)=>{
    try {
        // Extract email and password from the request body
        const {email,password}=req.body;

        // Validate that both email and password are provided
        if(!email || !password){
            // Return 400 Bad Request if any field is missing
            return res.status(400).json({message: "Please fill all the fields", success:false});
        }

        // Get admin credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        console.log(adminEmail);
        console.log(adminPassword);
        console.log(email);
        console.log(password);
        // Check if provided credentials match the admin credentials from environment
        if(email !== adminEmail || password !== adminPassword){
            // Return 401 Unauthorized if credentials don't match
            return res.status(401).json({message: "Invalid credentials", success:false});
        }

        // Create JWT token with admin email and role as payload
        const token = jwt.sign(
            {email, role: "admin"}, // Include role in payload for authorization
            process.env.JWT_SECRET, // Use the correct JWT secret from environment
            {expiresIn: "1d"} // Token expires in 1 day
        )

        // Set the token as an HTTP-only cookie in the response
        // res.cookie("token", token, {
        //     httpOnly: true, // Cookie cannot be accessed via JavaScript (prevents XSS attacks)
        //     secure: isProduction, // Cookie is only sent over HTTPS in production
        //     sameSite: isProduction ? "none" : "strict", // 'none' for cross-origin in production, 'strict' for local dev
        //     maxAge: 24*60*60*1000 // Cookie expires in 24 hours (in milliseconds)
        // });
        // console.log(token);
        

        // Return success response with admin email
        return res.status(201).json({
            message: "Admin logged in successfully",
            success:true,
            admin: {
                email: email,
                role: "admin",
                token: token
            }
        });
    } catch (error) {
        // Log error message to console for debugging
        console.log(error.message);
        // Return 500 Internal Server Error if something goes wrong
        return res.status(500).json({message: "Internal Server Error", success:false});
    }
}

/**
 * Controller function to verify if the user is authenticated
 * Used by the frontend to check login status on page load or route navigation.
 * Returns the user data if the token is valid, allowing the frontend to restore the session.
 *
 * @param {Object} req - Express request object (req.user set by protect middleware)
 * @param {Object} res - Express response object
 */
export const isAuth = async (req, res) => {
    try {
        // Get user ID from the decoded token (attached by protect middleware)
        const userId = req.user.userId;

        // Find user in database by ID and exclude password field
        const user = await User.findById(userId).select('-password');

        // If user not found (token valid but user deleted), return error
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Return success with user data, confirming the session is valid
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin || false
            }
        });
    } catch (error) {
        // Log error message to console for debugging
        console.log(error.message);
        // Return 500 Internal Server Error if something goes wrong
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

// Controller function to get user profile
export const getProfile = async (req, res) => {
    try {
        // Get user ID from the decoded token (attached by protect middleware)
        const userId = req.user.userId;

        // Find user in database by ID and exclude password field
        const user = await User.findById(userId).select('-password');

        // If user not found, return error
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Return user profile data
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin || false
            }
        });
    } catch (error) {
        // Log error message to console for debugging
        console.log(error.message);
        // Return 500 Internal Server Error if something goes wrong
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}
