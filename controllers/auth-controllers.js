import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";

import User from "../models/User.js";

import { HttpError } from "../helpers/index.js";

import { userSignUp, userLogIn } from "../models/User.js";

const avatarsPath = path.resolve("public", "avatars");
const { JWT_SECRET_KEY } = process.env;

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

    // const { path: oldPath, filename } = req.file;
    // const newPath = path.join(avatarsPath, filename);
    // await fs.rename(oldPath, newPath);
    // const avatar = path.join("avatars", filename);

    const avatarURL = gravatar.url(email);

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });

    res.json({
      email: newUser.email,
      subscription: newUser.subscription,
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

export default {
  signUp,
  logIn,
  getCurrent,
  logOut,
};
