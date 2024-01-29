import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";

import User from "../models/User.js";

import { HttpError, sendEmail } from "../helpers/index.js";

import { userSignUp, userLogIn, userEmailShema } from "../models/User.js";

const avatarsPath = path.resolve("public", "avatars");
const { JWT_SECRET_KEY, BASE_URL } = process.env;

const signUp = async (req, res, next) => {
  try {
    const body = req.body;
    const { error } = userSignUp.validate(body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email already in use");
    }
    const avatarURL = gravatar.url(email);

    const hashPassword = await bcrypt.hash(password, 10);

    const verificationToken = nanoid();

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const mailOptions = {
      to: email,
      subject: "Email verification",
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click here to verify email</a>`,
    };

    await sendEmail(mailOptions);

    res.json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw HttpError(400, "Email not found or already verified");
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationCode: "",
    });
    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

const resendVerifyEmail = async (req, res, next) => {
  try {
    const body = req.body;
    const { error } = userEmailShema.validate(body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(404, "Email not found");
    }
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const mailOptions = {
      to: email,
      subject: "Email verification",
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click here to verify email</a>`,
    };

    await sendEmail(mailOptions);

    res.json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};

const logIn = async (req, res, next) => {
  try {
    const body = req.body;
    const { error } = userLogIn.validate(body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password invalid");
    }

    if (!user.verify) {
      throw HttpError(401, "Email not verify");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }
    const id = user._id;
    const payload = {
      id,
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(id, { token });
    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logOut = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.sendStatus(204);
};

const getCurrent = (req, res, next) => {
  try {
    const { username, email } = req.user;

    res.json({
      username,
      email,
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarsPath, filename);
    await fs.rename(oldPath, newPath);
    const avatar = path.join("avatars", filename);
    Jimp.read(newPath, (error, image) => {
      if (error) throw HttpError(404, "Avatar not found");
      image.resize(250, 250).write(newPath);
    });
    await User.findByIdAndUpdate(_id, { avatarURL: avatar });
    res.json({
      avatarURL: avatar,
    });
  } catch (error) {
    next(error);
  }
};
export default {
  signUp,
  verify,
  resendVerifyEmail,
  logIn,
  getCurrent,
  logOut,
  updateAvatar,
};
