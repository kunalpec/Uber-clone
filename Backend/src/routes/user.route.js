import express from "express";
import { body } from "express-validator";
import {
  registerUser,
  loginUser,
  UserProfile,
  UserLogOut,
} from "../controllers/user.controller.js";
import { authUserMiddleware } from "../middlewares/auth.middleware.js";
export const userRouter = express.Router();

userRouter.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),

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
  ],
  registerUser,
);

userRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  loginUser,
);

userRouter.get("/profile",authUserMiddleware, UserProfile);

userRouter.get("/logout",authUserMiddleware,UserLogOut);
