import { HttpError } from "../helpers/index.js";

const isEmptyBody = (req, res, next) => {
  const { length } = Object.keys(req.body);
  if (!length) {
    throw HttpError(400, "Body must have fields");
  }
  next();
};

export default isEmptyBody;
