import express from "express";
import { loginUser, logoutUser, adminLogin, registerUser} from "../controllers/authControllers.js";

const authRoutes=express.Router();

authRoutes.post("/login",loginUser);
authRoutes.post("/logout",logoutUser);
authRoutes.post("/admin/login",adminLogin);
authRoutes.post("/register",registerUser);

export default authRoutes;