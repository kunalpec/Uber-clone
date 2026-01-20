import { Captain } from "../models/captain.model.js";
import { asyncHandler } from "../utils/AsyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { createCaptain } from "../services/captain.service.js";
import { validationResult } from "express-validator";

const generateToken = async (captainId) => {
  const captain = await Captain.findById(captainId);

  const accessToken = captain.generateAccessToken();
  const refreshToken = captain.generateRefreshToken();

  captain.refreshToken = refreshToken;
  await captain.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// register Captain -----------------------------------
export const registerCaptain = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }

  const { fullname, email, password, vehicle } = req.body;
  const isCaptainAlreadyExist = await Captain.findOne({ email });
  if (isCaptainAlreadyExist) {
    throw new ApiError(400, "Captain will same email already exits");
  }
  const captain = await createCaptain(
    fullname.firstname,
    fullname.lastname,
    email,
    password,
    vehicle,
  );

  res
    .status(201)
    .json(new ApiResponse(201, { captain }, "Captain registered successfully"));
});

// login Captain -------------------------------------
export const loginCaptain = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array());
  }

  const { email, password } = req.body;

  const captain = await Captain.findOne({ email }).select("+password");
  if (!captain) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await captain.ComparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } = await generateToken(captain._id);

  captain.password = undefined;
  captain.refreshToken = undefined;

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(new ApiResponse(200, { captain,accessToken }, "Captain login successful"));
});

// capatain profile ----------------------------------
export const CaptainProfile = asyncHandler(async (req, res) => {
  const captain = await Captain.findById(req.captain._id);
  if (!captain) {
    throw new ApiError(404, "Captain not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, captain, "Captain profile fetched successfully"),
    );
});

// captain logout ------------------------------------
export const CaptainLogOut = asyncHandler(async (req, res) => {
  const captainId = req.captain._id;

  await Captain.findByIdAndUpdate(
    captainId,
    { $unset: { refreshToken: 1 } },
    { new: true, runValidators: false },
  );

  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .status(200)
    .json(new ApiResponse(200, null, "Captain logout successful"));
});
