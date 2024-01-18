export const handleSaveErr = (err, data, next) => {
  err.status = 400;
  next();
};

export const addUpdSettings = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
