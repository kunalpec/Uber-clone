import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";

export const createUser = async (firstname, lastname, email, password) => {
  if (!firstname || !email || !password) {
    throw new ApiError(400, "All required fields must be provided...");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }
  const user = await User.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
  });
  return user;
};

