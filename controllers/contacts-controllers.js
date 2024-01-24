import Contact from "../models/Contact.js";

import { HttpError } from "../helpers/index.js";

import {
  contactAddShema,
  contactUpdShema,
  movieFavoriteUpdSchema,
} from "../models/Contact.js";

const getAll = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({ owner }, "", { skip, limit }).populate(
      "owner",
      "email"
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOne({ contactId, owner });
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
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndDelete({ contactId, owner });
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
    const { error } = contactUpdShema.validate(body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndUpdate({ contactId, owner }, body);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const updateFavoriteById = async (req, res, next) => {
  try {
    const body = req.body;
    const { error } = movieFavoriteUpdSchema.validate(body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndUpdate({ contactId, owner }, body);
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
  updateFavoriteById,
};
