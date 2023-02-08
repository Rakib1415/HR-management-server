const createError = require('http-errors');

const notFoundHandler = (req, res, next) => {
  const error = createError(404, 'Resourch is not found!');
  next(error);
};

const errorHandler = (error, req, res, next) => {
  if (error.status) {
    return res.status(error.status).json({ message: error.message });
  }
  return res.status(500).json({ message: 'Something went wrong!' });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
