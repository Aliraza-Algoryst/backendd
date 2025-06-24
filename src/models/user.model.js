import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { type } from "os";

const userSchema = new mongoose.Schema(
  {
    username: {
      lowercase: true,
      required: [true, "Username is required"],
      trim: true,
      type: String,
    },
    email: {
      unique: true,
      lowercase: true,
      required: [true, "Email is required"],
      trim: true,
      type: String,
    },

    password: {
      required: [true, "Password is required"],
      type: String,
    },
    phonenumber: {
      type: Number,
    },

    isDoctor: {
      type: Boolean,
      default: false,
    },
    referralSource: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
