import Contact from "../models/Contact.js";

import { HttpError } from "../helpers/index.js";

import {
  contactAddShema,
  contactUpdShema,
  movieFavoriteUpdSchema,
} from "../models/Contact.js";

const getAll = async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw HttpError(404, `Contact with id=${contactId} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const body = req.body;
    const { error } = contactAddShema.validate(body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await Contact.create(body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
      throw HttpError(404, `Contact with id=${contactId} not found`);
    }
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

const updateContactById = async (req, res, next) => {
  console.log(req.route.path);
  try {
    const body = req.body;
    if (req.route.path === "/:contactId/favorite") {
      const { error } = movieFavoriteUpdSchema.validate(body);
      if (error) {
        throw HttpError(400, error.message);
      }
    }
    const { error } = contactUpdShema.validate(body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, body);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getAll,
  getById,
  addContact,
  deleteContact,
  updateContactById,
};
