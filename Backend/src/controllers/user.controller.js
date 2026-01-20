import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { createUser } from "../services/user.service.js";
import { validationResult } from "express-validator";

const generateToken = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return { accessToken, refreshToken };
};

// register User ---------------------------------------------
export const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }
  const { fullname, email, password } = req.body;
  const response = await createUser(fullname.firstname, fullname.lastname, email, password);
  const user = response;
  const tokens = await generateToken(user._id);
  res.status(201).json(
    new ApiResponse(
      201,
      {
        user,
        ...tokens,
      },
      "User registered successfully",
    ),
  );
});
// ------------------------------------------------------------
