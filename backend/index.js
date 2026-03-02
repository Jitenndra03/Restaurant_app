import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {connectDB} from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app=express();

// database connection
connectDB();
//middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const PORT=process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send("Hello World");
});

app.use("/api/auth", authRoutes)

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));