import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


// PART-1 crearte app Object
const app=express();

// PART-2 Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import { userRouter } from "./routes/user.route.js";
import { captainRouter } from "./routes/captain.route.js";

app.use("/users",userRouter);
app.use("/captain",captainRouter)

export default app;