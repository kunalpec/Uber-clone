import { Captain } from "../models/captain.model.js";
import { ApiError } from "../utils/ApiError.util.js";

export const createCaptain = async (
  firstname,
  lastname,
  email,
  password,
  vehicle,
) => {
  if (!firstname || !email || !password || !vehicle) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const existingCaptain = await Captain.findOne({ email });
  if (existingCaptain) {
    throw new ApiError(409, "Captain already exists");
  }

  const captain = await Captain.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    vehicle,
  });

  return captain;
};
