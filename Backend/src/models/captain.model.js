import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const captainSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        minlength: [3, "First name must be at least 3 characters"],
      },
      lastname: {
        type: String,
        minlength: [3, "Last name must be at least 3 characters"],
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      minlength: [5, "User email must be at least 5 characters"],
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    socketId: {
      type: String,
    },

    refreshToken: {
      type: String,
      select: false, // 🔐 recommended
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },

    vehicle: {
      color: {
        type: String,
        required: true,
        trim: true,
      },
      plate: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
      },
      capacity: {
        type: Number,
        required: true,
        min: 1,
      },
      vehicleType: {
        type: String,
        required: true,
        enum: ["car", "auto", "motorcycle"],
      },
      model: {
        type: String,
        trim: true,
      },
      brand: {
        type: String,
        trim: true,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      documents: {
        rc: {
          type: String,
        },
        insurance: {
          type: String,
        },
      },
    },

    location: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
  },
  { timestamps: true },
);
/* =========================
   PRE SAVE (hash password)
========================= */
captainSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

/* =========================
  COMPARE PASSWORD
========================= */
captainSchema.methods.ComparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/* =========================
   GENERATE ACCESS TOKEN
========================= */
captainSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

/* =========================
   GENERATE REFRESH TOKEN
========================= */
captainSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
};

export const Captain = mongoose.model("Captain", captainSchema);
