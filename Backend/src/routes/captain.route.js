import express from "express";
import { body } from "express-validator";
import {
  registerCaptain,
  loginCaptain,
  CaptainProfile,
  CaptainLogOut,
} from "../controllers/captain.controller.js";
import { authCaptainMiddleware } from "../middlewares/auth.middleware.js";

export const captainRouter = express.Router();

captainRouter.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid Email"),

    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters"),

    body("fullname.lastname")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Last name must be at least 3 characters"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    body("vehicle.color")
      .notEmpty()
      .withMessage("Vehicle color is required"),

    body("vehicle.plate")
      .notEmpty()
      .withMessage("Vehicle plate is required"),

    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Vehicle capacity must be at least 1"),

    body("vehicle.vehicleType")
      .isIn(["car", "auto", "motorcycle"])
      .withMessage("Invalid vehicle type"),
  ],
  registerCaptain
);

captainRouter.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid Email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  loginCaptain
);

captainRouter.get("/profile", authCaptainMiddleware, CaptainProfile);

captainRouter.get("/logout", authCaptainMiddleware, CaptainLogOut);
