import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveErr, addUpdSettings } from "./hooks.js";

const subscriptionList = ["starter", "pro", "business"];
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegex,
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptionList,
      default: "starter",
    },
    avatarURL: String,
    token: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
  },
  { versionKey: false }
);

export const userSignUp = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});

export const userLogIn = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});

export const userAvatar = Joi.object({
  avatar: Joi.string().required(),
});

export const userEmailShema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});

userSchema.post("save", handleSaveErr);

userSchema.pre("findOneAndUpdate", addUpdSettings);

userSchema.post("findOneAndUpdate", handleSaveErr);

const User = model("user", userSchema);

export default User;
