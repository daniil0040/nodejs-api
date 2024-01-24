import express from "express";

import authControllers from "../../controllers/auth-controllers.js";

import { isEmptyBody, authenticate } from "../../middlewares/index.js";

const authRouter = express.Router();

authRouter.post("/signup", isEmptyBody, authControllers.signUp);
authRouter.post("/login", isEmptyBody, authControllers.logIn);
authRouter.post("/logout", authenticate, authControllers.logOut);
authRouter.get("/current", authenticate, authControllers.getCurrent);

export default authRouter;
