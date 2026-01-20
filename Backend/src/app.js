import express from "express";
import cors from "cors";

// PART-1 crearte app Object
const app=express();

// PART-2 Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

import { userRouter } from "./routes/user.route.js";

app.use("/users",userRouter);

export default app;