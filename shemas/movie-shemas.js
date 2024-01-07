import Joi from "joi";

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
