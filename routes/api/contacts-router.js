import express from "express";

import moviesController from "../../controllers/contacts-controllers.js";

import { isEmptyBody } from "../../middlewares/index.js";

const contactsRouter = express.Router();

contactsRouter.get("/", moviesController.getAll);

contactsRouter.get("/:contactId", moviesController.getById);

contactsRouter.post("/", isEmptyBody, moviesController.addContact);

contactsRouter.delete("/:contactId", moviesController.deleteContact);

contactsRouter.put(
  "/:contactId",
  isEmptyBody,
  moviesController.updateContactById
);

export default contactsRouter;
