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

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// register User ---------------------------------------------
export const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }
  const { fullname, email, password } = req.body;
  const isUserAlreadyExist = await Captain.findOne({ email });
  if (isUserAlreadyExist) {
    throw new ApiError(400, "User will same email already exits");
  }
  const response = await createUser(
    fullname.firstname,
    fullname.lastname,
    email,
    password,
  );
  const user = response;
  res.status(201).json(
    new ApiResponse(
      201,
      {
        user,
      },
      "User registered successfully",
    ),
  );
});
// ------------------------------------------------------------

// login User -------------------------------------------------
export const loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.ComparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } = await generateToken(user._id);

  user.password = undefined;
  user.refreshToken = undefined;

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // TEMP (Postman / localhost)
      sameSite: "lax", // TEMP
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // TEMP
      sameSite: "lax", // TEMP
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user,accessToken
        },
        "Login successful",
      ),
    );
});
// ------------------------------------------------------------

// User Profile -----------------------------------------------
export const UserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

// ------------------------------------------------------------

// User LogOut ------------------------------------------------
export const UserLogOut = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await User.findByIdAndUpdate(
    userId,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true, runValidators: false },
  );

  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .status(200)
    .json(new ApiResponse(200, null, "Logout successful"));
});

// ------------------------------------------------------------
