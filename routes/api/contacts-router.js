import express from "express";

import contactsController from "../../controllers/contacts-controllers.js";

import { isEmptyBody, isValidId } from "../../middlewares/index.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:contactId", isValidId, contactsController.getById);

contactsRouter.post("/", isEmptyBody, contactsController.addContact);

contactsRouter.patch(
  "/:contactId/favorite",
  isValidId,
  isEmptyBody,
  contactsController.updateFavoriteById
);

contactsRouter.delete(
  "/:contactId",
  isValidId,
  contactsController.deleteContact
);

contactsRouter.put(
  "/:contactId",
  isValidId,
  isEmptyBody,
  contactsController.updateContactById
);

export default contactsRouter;
