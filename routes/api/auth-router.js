import express from "express";

import authControllers from "../../controllers/auth-controllers.js";

import { isEmptyBody, authenticate, upload } from "../../middlewares/index.js";

const authRouter = express.Router();

authRouter.post("/signup", isEmptyBody, authControllers.signUp);
authRouter.get("/verify/:verificationToken", authControllers.verify);
authRouter.post("/verify", isEmptyBody, authControllers.resendVerifyEmail);
authRouter.post("/login", isEmptyBody, authControllers.logIn);
authRouter.post("/logout", authenticate, authControllers.logOut);
authRouter.get("/current", authenticate, authControllers.getCurrent);
authRouter.patch(
  "/avatars",
  upload.single("avatarURL"),
  authenticate,
  authControllers.updateAvatar
);

export default authRouter;
