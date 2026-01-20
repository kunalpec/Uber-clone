import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Captain } from "../models/captain.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/AsyncHandler.util.js";

// User Middleware
export const authUserMiddleware = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decoded._id);
  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  req.user = user;
  next();
});

// Captain Middleware
export const authCaptainMiddleware = asyncHandler(async (req, res, next) => {
  const token =req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const captain = await Captain.findById(decoded._id);
  if (!captain) {
    throw new ApiError(401, "Invalid access token");
  }

  req.captain = captain;
  next();
});
