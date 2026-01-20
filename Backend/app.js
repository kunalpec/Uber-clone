import express from "express";
import cors from "cors";

// PART-1 crearte app Object
const app=express();

// PART-2 Middleware
app.use(cors());

app.get('/',(req,res)=>{
  res.send("Hello World!");
});

export default app;