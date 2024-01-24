import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveErr, addUpdSettings } from "./hooks.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

export const contactAddShema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.number().required(),
});

export const contactUpdShema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.number(),
});

export const movieFavoriteUpdSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

contactSchema.post("save", handleSaveErr);

contactSchema.pre("findOneAndUpdate", addUpdSettings);

contactSchema.post("findOneAndUpdate", handleSaveErr);

const Contact = model("contact", contactSchema);

export default Contact;
